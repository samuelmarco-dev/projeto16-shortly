import chalk from "chalk";

import schemaSignUp from "../utils/schemaSignUp.js";
import db from "../database.js";

function validateSchemaSignUp(req, res, next){
    const {name, email, password, confirmPassword} = req.body;

    if(!confirmPassword) return res.status(400).send('All fields are mandatory');
    const validation = schemaSignUp.validate({name, email, password, confirmPassword}, {abortEarly: false});

    const {error} = validation;
    if(error){
        return res.status(422).send(error.details.map(detail => detail.message));
    }
    next();
}

async function userExistsEmail(req, res, next){
    const {email} = req.body;
    
    try {
        const userCadastrado = await db.query(`
            SELECT * FROM users WHERE email = $1
        `, [email]);

        if(userCadastrado.rowCount) return res.status(409).send('This email already exists in the database');
        next();
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export { validateSchemaSignUp, userExistsEmail };