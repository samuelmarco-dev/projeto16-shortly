import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

import db from '../database.js';

dotenv.config();

export async function createShortUrlUser(req, res) {
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    console.log('Token na requisição', token);
    if(!token) return res.status(401).send('User is not authorized');
    
    const {url} = req.body;

    try {
        console.log('teste');
        const secretKey = process.env.JWT_SECRET;
        const dados = jwt.verify(token, secretKey);
        console.log('Verificação do token', jwt.verify(token, secretKey), dados);

        //buscar a sessão do usuário
        const session = await db.query(`
            SELECT * FROM sessions WHERE token = $1
        `, [token]);
        console.log('sessão encontrada', session);

        //encontrar o usuário que fez login
        const user = await db.query(`
            SELECT * FROM users WHERE id = $1
        `, [session.userId]);
        console.log('usuário encontrado', user);

        //criar url encurtada
        const urlShort = nanoid();
        
        await db.query(`
            INSERT INTO links (url, shortUrl)
            VALUES ($1, $2)
        `, [url, urlShort]);
        await db.query(`
            INSERT INTO "linksUsers" ("linkId", "userId", views)
            VALUES ((SELECT id FROM links WHERE url = $1), $2, 0)
        `, [url, user.id]);
        
        res.status(201).send(urlShort);
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function getShortUrl(req, res) {
    try {
        console.log('teste');
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function getShortUrlRedirect(req, res) {
    try {
        console.log('teste');
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function deleteShortUrlUser(req, res) {
    try {
        console.log('teste');
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}
