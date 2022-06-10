import chalk from "chalk";

import db from "../database.js";

async function countViewsUser(req, res, next){
    const {id} = req.params;
    
    try {
        const viewsTotal = await db.query(`
            SELECT SUM(lusr."views") as "sumViews"
            FROM "linksUsers" lusr WHERE lusr."userId" = $1
        `, [id]);

        const viewsId = viewsTotal.rows[0];
        const verifyViews = !viewsId || viewsTotal.rowCount !== 1 || !viewsId.sumViews;
        if(verifyViews) return res.sendStatus(401);

        res.locals.viewsId = viewsId;
        next();
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

async function resultRankingUsers(req, res, next){
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

        const verify = result.rowCount === 0 || result.rows.length === 0;
        if(verify) return res.sendStatus(404);

        res.locals.ranking = result.rows;
        next();
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export { countViewsUser, resultRankingUsers };