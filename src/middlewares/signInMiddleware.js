import chalk from "chalk";

import schemaSignIn from "../utils/schemaSignIn.js";
import db from "../database.js";

function validateSchemaSignIn(req, res, next){
    const {email, password} = req.body;
    
    const validation = schemaSignIn.validate({email, password}, {abortEarly: false});
    const {error} = validation;
    
    if(error){
        return res.status(422).send(error.details.map(detail => detail.message));
    }
    next();
}

async function loginPermission(req, res, next){
    const {email} = req.body;
    
    try {
        const userExistente = await db.query(`
            SELECT * FROM users WHERE email = $1
        `, [email]);
        
        const [user] = userExistente.rows;
        const failure = userExistente.rowCount === 0 || userExistente.rowCount > 1;
        if(!user || failure) return res.sendStatus(404);

        res.locals.user = user;
        res.locals.userExistente = userExistente;
        next();
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export { validateSchemaSignIn, loginPermission };