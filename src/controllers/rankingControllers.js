import dotenv from 'dotenv';
import chalk from 'chalk';

import db from '../database.js';

dotenv.config();

export async function detailsUrlsUser(req, res){    
    const {id} = req.params;
    console.log('id do usuario', id);
    const {userExiste, viewsId} = res.locals;
    console.log('userExiste', userExiste);
    console.log('viewsId', viewsId);

    try {
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
        const result = await db.query(`
            SELECT users.id, users.name, 
            COUNT("linksUsers"."linkId") as "linksCount", 
            SUM("linksUsers"."views") as "visitCount"
            FROM "linksUsers"
            LEFT JOIN users ON "linksUsers"."userId" = users.id
            GROUP BY "linksUsers"."userId", users.id 
            ORDER BY "visitCount" DESC LIMIT 10
        `, []);
        console.log('resultado da query', result);

        const verify = result.rowCount === 0 || result.rows.length === 0;
        if(verify) return res.sendStatus(404);

        res.send(result.rows).status(200);
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}
