import chalk from "chalk";

import db from "../database.js";

async function filterUrlById(req, res, next){
    const {id} = req.params;
    
    try {
        const link = await db.query(`
            SELECT id, url, "shortUrl" FROM links WHERE id = $1
        `, [id]);

        const [linkId] = link.rows;
        const verify = !linkId || link.rowCount !== 1 || !linkId.shortUrl;
        if(verify) return res.sendStatus(404);

        res.locals.linkId = linkId;
        next();
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

async function updateSelectViews(req, res, next){
    const {shortUrl} = req.params;
    
    try {
        const urlEncurtada = await db.query(`
            SELECT * FROM links WHERE "shortUrl" = $1
        `, [shortUrl]);

        const [url] = urlEncurtada.rows;
        const verifyShortUrl = !url || urlEncurtada.rowCount !== 1 || url.shortUrl !== shortUrl;
        if(verifyShortUrl || !url.shortUrl) return res.sendStatus(404);
        
        const relacaoUrl = await db.query(`
            SELECT * FROM "linksUsers" WHERE "linkId" = $1
        `, [url.id]);
        
        const [relacao] = relacaoUrl.rows;
        const verifyRelacao = !relacao || relacaoUrl.rowCount !== 1 || relacao.linkId !== url.id;
        if(verifyRelacao) return res.sendStatus(404);

        const views = relacao.views + 1;
        res.locals.views = views;
        res.locals.url = url;
        next();
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export { filterUrlById, updateSelectViews };