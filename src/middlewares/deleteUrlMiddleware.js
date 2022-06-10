import chalk from "chalk";

import db from "../database.js";

async function validateRelacionDeleteUrl(req, res, next){
    const {id} = req.params;
    const {idUser} = res.locals;
    
    try {
        const link = await db.query(`
            SELECT * FROM links WHERE id = $1
        `, [id]);

        const linkId = link.rows[0];
        const verifyLink = !linkId || link.rowCount !== 1 || linkId.id !== Number(id);
        if(!linkId.shortUrl) return res.sendStatus(404);
        if(verifyLink) return res.sendStatus(401);

        const relacao = await db.query(`
            SELECT * FROM "linksUsers" WHERE "linkId" = $1 AND "userId" = $2
        `, [Number(id), idUser]);

        const [relacaoId] = relacao.rows;
        const verifyRelacao = !relacaoId || relacao.rowCount !== 1 || relacaoId.linkId !== linkId.id || relacaoId.userId !== idUser;
        if(verifyRelacao) return res.sendStatus(401);

        next();
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export { validateRelacionDeleteUrl };