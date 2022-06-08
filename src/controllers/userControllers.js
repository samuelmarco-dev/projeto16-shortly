import joi from 'joi';
import bcrypt from 'bcrypt';
import chalk from 'chalk';

import db from '../database.js';

export async function signUpUser(req, res) {
    const { name, email, password, confirmPassword } = req.body;
    console.log('dados', name, email, password, confirmPassword);
    
    const regexName = /^[a-zA-ZáéíóúàâêôãõüçÁÉÍÓÚÀÂÊÔÃÕÜÇ ]+$/;
    const schemaSignUp = joi.object({
        name: joi.string().pattern(regexName).required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.ref('password')
    });

    const validation = schemaSignUp.validate({name, email, password, confirmPassword}, {abortEarly: false});
    console.log(validation);

    if(!confirmPassword) return res.status(400).send('All fields are mandatory');

    const { error } = validation;
    if(error){
        console.log(chalk.red('Erro de validação com joi'));
        return res.status(422).send(error.details.map(detail => detail.message));
    }

    try {
        const userExistente = await db.query(`
            SELECT * FROM users WHERE email = $1
        `, [email]);
        console.log(userExistente);
        if(userExistente.rowCount) return res.status(409).send('This email already exists in the database');
        
        console.log('podemos prosseguir');
        const passwordEncrypted = bcrypt.hashSync(password, 10);

        await db.query(`
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
        `, [name, email, passwordEncrypted]);

        res.sendStatus(201);
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function signInUser(req, res) {

}
