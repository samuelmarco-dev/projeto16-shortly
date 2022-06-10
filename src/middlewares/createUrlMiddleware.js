import chalk from "chalk";
import { nanoid } from 'nanoid';

import schemaUrl from "../utils/schemaUrl.js";
import db from "../database.js";

function validateSchemaUrl(req, res, next){
    const {url} = req.body;
    
    const validation = schemaUrl.validate({url}, {abortEarly: false});
    const {error} = validation;

    if(error){
        return res.status(422).send(error.details.map(detail => detail.message));
    }
    next();
}

async function validateRelationUrl(req, res, next){
    const {url} = req.body;
    
    try {
        const urlShort = nanoid();
        
        await db.query(`
            INSERT INTO links (url, "shortUrl")
            VALUES ($1, $2)
        `, [url, urlShort]);

        const linkCriado = await db.query(`
            SELECT * FROM links WHERE "shortUrl" = $1
        `, [urlShort]);

        const link = linkCriado.rows[0];
        const verifyLink = !link || linkCriado.rowCount !== 1 || link.shortUrl !== urlShort;
        if(verifyLink) return res.sendStatus(401);

        res.locals.link = link;
        res.locals.urlShort = urlShort;
        next();
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export { validateSchemaUrl, validateRelationUrl };