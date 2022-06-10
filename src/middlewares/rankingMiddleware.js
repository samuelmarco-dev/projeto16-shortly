import chalk from "chalk";

import db from "../database.js";

export async function countViewsUser(req, res, next){
    const {id} = req.params;
    console.log('id do usuario', id);
    
    try {
        const viewsTotal = await db.query(`
            SELECT SUM(lusr."views") as "sumViews"
            FROM "linksUsers" lusr WHERE lusr."userId" = $1
        `, [id]);
        console.log('views total', viewsTotal);

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