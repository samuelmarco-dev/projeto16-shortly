import dotenv from 'dotenv';

import db from '../database.js';

dotenv.config();

export async function createShortUrlUser(req, res) {
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    console.log('Token na requisição', token);
    if(!token) return res.status(401).send('User is not authorized');
    
    try {
        console.log('teste');
        const secretKey = process.env.JWT_SECRET;
        jwt.verify(token, secretKey);
        console.log('Verificação do token', jwt.verify(token, secretKey));

        //buscar a sessão do usuário
        //encontrar o usuário que fez login

    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function getShortUrl(req, res) {
    try {
        console.log('teste');
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function getShortUrlRedirect(req, res) {
    try {
        console.log('teste');
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function deleteShortUrlUser(req, res) {
    try {
        console.log('teste');
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}
