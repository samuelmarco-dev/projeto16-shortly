import joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import chalk from 'chalk';
import dotenv from 'dotenv';

import db from '../database.js';

dotenv.config();

export async function signUpUser(req, res) {
    const {name, email, password, confirmPassword} = req.body;
    console.log('dados cadastro', name, email, password, confirmPassword);
    
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

    const {error} = validation;
    if(error){
        console.log(chalk.red('Erro de validação com joi'));
        return res.status(422).send(error.details.map(detail => detail.message));
    }

    try {
        const userCadastrado = await db.query(`
            SELECT * FROM users WHERE email = $1
        `, [email]);
        console.log(userCadastrado);
        if(userCadastrado.rowCount) return res.status(409).send('This email already exists in the database');
        
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
    const {email, password} = req.body;
    console.log('dados login', email, password);

    const schemaSignIn = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });
    
    const validation = schemaSignIn.validate({email, password}, {abortEarly: false});
    console.log(validation);

    const {error} = validation;
    if(error){
        console.log(chalk.red('Erro de validação com joi'));
        return res.status(422).send(error.details.map(detail => detail.message));
    }

    try {
        const userExistente = await db.query(`
            SELECT * FROM users WHERE email = $1
        `, [email]);
        console.log(userExistente);
        
        const [user] = userExistente.rows;
        console.log(user);

        const failure = userExistente.rowCount === 0 || userExistente.rowCount > 1 || userExistente.rowCount < 0;
        if(!user || failure) return res.sendStatus(404);
        
        if(userExistente.rowCount === 1 && bcrypt.compareSync(password, user.password)){
            console.log('entrou no if');
            const secretKey = process.env.JWT_SECRET;
            const validityKey = {expiresIn: 10800}
            const token = jwt.sign({
                id: user.id,
            }, secretKey, validityKey);
            console.log(token, user.id);

            await db.query(`
                INSERT INTO sessions ("userId", token)
                VALUES ($1, $2)
            `, [user.id, token]);
            return res.status(200).send(token);
        }

        res.sendStatus(401);
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}
