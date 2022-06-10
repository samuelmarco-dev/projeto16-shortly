import dotenv from 'dotenv';
import chalk from 'chalk';

import db from '../database.js';

dotenv.config();

export async function detailsUrlsUser(req, res){    
    const {id} = req.params;
    const {userExiste, viewsId} = res.locals;

    try {
        const result = await db.query(`
            SELECT *  
            FROM "linksUsers" lusr
            JOIN "links" l ON lusr."linkId" = l.id
            WHERE lusr."userId" = $1
        `, [id]);

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

        res.send(object).status(200);
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function getRanking(req, res){
    const {ranking} = res.locals;
    
    try {
        res.send(ranking).status(200);
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}
