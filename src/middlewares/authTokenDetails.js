import chalk from "chalk";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import db from "../database.js";
dotenv.config();

async function tokenInDetailsUser(req, res, next){
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    console.log('Token na requisição', token);
    if(!token) return res.status(401).send('User is not authorized');
    
    const {id} = req.params;
    console.log('id do usuario', id);

    try {
        const secretKey = process.env.JWT_SECRET;
        const dados = jwt.verify(token, secretKey);
        console.log('Verificação do token', dados);
        
        const idUser = dados.id;
        console.log('id user', idUser);

        const session = await db.query(`
        SELECT * FROM sessions WHERE token = $1
        `, [token]);
        console.log('sessão encontrada', session);

        const userSession = session.rows[0];
        const verify = !userSession || session.rowCount !== 1 || userSession.userId !== idUser;
        if(verify) return res.sendStatus(401);

        const user = await db.query(`
            SELECT * FROM users WHERE id = $1
        `, [idUser]);
        console.log('usuário encontrado', user);

        const userExiste = user.rows[0];
        const verifyUser = user.rowCount !== 1 || userExiste.id !== idUser || userExiste.id !== Number(id);
        if(!userExiste) return res.sendStatus(404);
        if(verifyUser) return res.sendStatus(401);

        res.locals.userExiste = userExiste;
        next();
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);        
    }
}

export { tokenInDetailsUser };