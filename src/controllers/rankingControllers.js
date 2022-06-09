import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import chalk from 'chalk';

import db from '../database.js';

dotenv.config();

export async function detailsUrlsUser(req, res){
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    console.log('Token na requisição', token);
    if(!token) return res.status(401).send('User is not authorized');
    
    const {id} = req.params;
    console.log('id do usuario', id);

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
        const verifyUser = user.rowCount !== 1 || userExiste.id !== idUser || userExiste.id !== Number(id);
        if(!userExiste) return res.sendStatus(404);
        if(verifyUser) return res.sendStatus(401);

        const viewsTotal = await db.query(`
            SELECT SUM(lusr."views") as "sumViews"
            FROM "linksUsers" lusr WHERE lusr."userId" = $1
        `, [id]);
        console.log('views total', viewsTotal);

        const viewsId = viewsTotal.rows[0];
        const verifyViews = !viewsId || viewsTotal.rowCount !== 1 || !viewsId.sumViews;
        if(verifyViews) return res.sendStatus(401);

        const result = await db.query(`
            SELECT *  
            FROM "linksUsers" lusr
            JOIN "links" l ON lusr."linkId" = l.id
            WHERE lusr."userId" = $1
        `, [id]);
        console.log('resultado da query', result);

        const object = {
            "id": userExiste.id,
            "name": userExiste.name,
            "visitCount": Number(viewsId.sumViews),
            "shortenedUrls": result.rows.map(row => {
                return {
                    "id": row.linkId,
                    "shortUrl": row.shortUrl,
                    "url": row.url,
                    "visitCount": row.views,
                }
            })
        };
        console.log('objeto', object);

        res.send(object).status(200);
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function getRanking(req, res){
    try {
        
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}
