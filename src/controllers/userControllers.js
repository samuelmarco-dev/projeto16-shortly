import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import chalk from 'chalk';
import dotenv from 'dotenv';

import db from '../database.js';
dotenv.config();

export async function signUpUser(req, res) {
    const {name, email, password} = req.body;

    try {
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
    const {password} = req.body;
    const {user, userExistente} = res.locals;

    try {
        if(userExistente.rowCount === 1 && bcrypt.compareSync(password, user.password)){
            const secretKey = process.env.JWT_SECRET;
            const validityKey = {expiresIn: 10800}
            const token = jwt.sign({
                id: user.id,
            }, secretKey, validityKey);

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
