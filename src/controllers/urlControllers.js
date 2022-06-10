import dotenv from 'dotenv';
import chalk from 'chalk';

import db from '../database.js';
dotenv.config();

export async function createShortUrlUser(req, res) {
    const {idUser, link, urlShort} = res.locals;

    try {
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
    const {linkId} = res.locals;
    
    try {
        res.send(linkId).status(200);
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function getShortUrlRedirect(req, res) {
    const {views, url} = res.locals;
    
    try {
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
    const {id} = req.params;
    const {idUser} = res.locals;
    
    try {
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
