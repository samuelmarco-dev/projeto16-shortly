import joi from 'joi';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import chalk from 'chalk';

import db from '../database.js';

dotenv.config();

export async function createShortUrlUser(req, res) {
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    console.log('Token na requisição', token);
    if(!token) return res.status(401).send('User is not authorized');
    
    const {url} = req.body;
    const schemaUrl = joi.object({
        url: joi.string().uri().required()
    });

    const validation = schemaUrl.validate({url}, {abortEarly: false});
    console.log(validation);

    const {error} = validation;
    if(error){
        console.log(chalk.red('Erro de validação com joi'));
        return res.status(422).send(error.details.map(detail => detail.message));
    }

    try {
        const secretKey = process.env.JWT_SECRET;
        const dados = jwt.verify(token, secretKey);
        console.log('Verificação do token', dados);
        
        const idUser = dados.id;
        console.log('id user', idUser);

        const session = await db.query(`
            SELECT * FROM sessions WHERE token = $1
        `, [token]);
        console.log('sessão encontrada', session);

        const userSession = session.rows[0];
        const verify = !userSession || session.rowCount !== 1 || userSession.userId !== idUser;
        if(verify) return res.sendStatus(401);

        const user = await db.query(`
            SELECT * FROM users WHERE id = $1
        `, [idUser]);
        console.log('usuário encontrado', user);

        const userExiste = user.rows[0];
        const verifyUser = !userExiste || user.rowCount !== 1 || userExiste.id !== idUser;
        if(verifyUser) return res.sendStatus(401);

        const urlShort = nanoid();
        console.log('url encurtada', urlShort);
        
        await db.query(`
            INSERT INTO links (url, "shortUrl")
            VALUES ($1, $2)
        `, [url, urlShort]);

        const linkCriado = await db.query(`
            SELECT * FROM links WHERE "shortUrl" = $1
        `, [urlShort]);
        console.log('link criado', linkCriado);

        const link = linkCriado.rows[0];
        const verifyLink = !link || linkCriado.rowCount !== 1 || link.shortUrl !== urlShort;
        if(verifyLink) return res.sendStatus(401);

        await db.query(`
            INSERT INTO "linksUsers" ("linkId", "userId", views)
            VALUES ($1, $2, $3)
        `, [link.id, idUser, Number(0)]);
        
        res.status(201).send(urlShort);
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function getShortUrl(req, res) {
    const {id} = req.params;
    console.log('id enviado', id);

    try {
        const link = await db.query(`
            SELECT id, url, "shortUrl" FROM links WHERE id = $1
        `, [id]);
        console.log(link);

        const [linkId] = link.rows;
        const verify = !linkId || link.rowCount !== 1 || !linkId.shortUrl;
        if(verify) return res.sendStatus(404);
        
        res.send(linkId).status(200);
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function getShortUrlRedirect(req, res) {
    const {shortUrl} = req.params;
    console.log('url encurtada enviada', shortUrl);
    
    try {
        const urlEncurtada = await db.query(`
            SELECT * FROM links WHERE "shortUrl" = $1
        `, [shortUrl]);
        console.log('url encontrada', urlEncurtada);

        const [url] = urlEncurtada.rows;
        const verifyShortUrl = !url || urlEncurtada.rowCount !== 1 || url.shortUrl !== shortUrl;
        if(verifyShortUrl || !url.shortUrl) return res.sendStatus(404);
        
        const relacaoUrl = await db.query(`
            SELECT * FROM "linksUsers" WHERE "linkId" = $1
        `, [url.id]);
        console.log('relacao entre linkId e userId', relacaoUrl);
        
        const [relacao] = relacaoUrl.rows;
        const verifyRelacao = !relacao || relacaoUrl.rowCount !== 1 || relacao.linkId !== url.id;
        if(verifyRelacao) return res.sendStatus(404);

        const views = relacao.views + 1;
        await db.query(`
            UPDATE "linksUsers" SET views = $1 WHERE "linkId" = $2
        `, [views, url.id]);

        res.redirect(url.url);
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function deleteShortUrlUser(req, res) {
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    console.log('Token na requisição', token);
    if(!token) return res.status(401).send('User is not authorized');

    const {id} = req.params;
    console.log('id link enviado', id);
    
    try {
        const secretKey = process.env.JWT_SECRET;
        const dados = jwt.verify(token, secretKey);
        console.log('Verificação do token', dados);
        
        const idUser = dados.id;
        console.log('id user', idUser);

        const session = await db.query(`
        SELECT * FROM sessions WHERE token = $1
        `, [token]);
        console.log('sessão encontrada', session);

        const userSession = session.rows[0];
        const verify = !userSession || session.rowCount !== 1 || userSession.userId !== idUser;
        if(verify) return res.sendStatus(401);

        const user = await db.query(`
            SELECT * FROM users WHERE id = $1
        `, [idUser]);
        console.log('usuário encontrado', user);

        const userExiste = user.rows[0];
        const verifyUser = !userExiste || user.rowCount !== 1 || userExiste.id !== idUser;
        if(verifyUser) return res.sendStatus(401);

        const link = await db.query(`
            SELECT * FROM links WHERE id = $1
        `, [id]);
        console.log('link encontrado', link);

        const linkId = link.rows[0];
        const verifyLink = !linkId || link.rowCount !== 1 || linkId.id !== Number(id) || !linkId.shortUrl;
        if(verifyLink) return res.sendStatus(401);

        const relacao = await db.query(`
            SELECT * FROM "linksUsers" WHERE "linkId" = $1 AND "userId" = $2
        `, [Number(id), idUser]);
        console.log('relacao entre linkId e userId', relacao);

        const [relacaoId] = relacao.rows;
        const verifyRelacao = !relacaoId || relacao.rowCount !== 1 || relacaoId.linkId !== linkId.id || relacaoId.userId !== idUser;
        if(verifyRelacao) return res.sendStatus(401);

        await db.query(`
            DELETE FROM "linksUsers" WHERE "linkId" = $1 AND "userId" = $2
        `, [Number(id), idUser]);
        await db.query(`
            DELETE FROM links WHERE id = $1
        `, [id]);

        res.sendStatus(200);
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}
