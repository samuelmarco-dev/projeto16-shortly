import joi from 'joi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import chalk from 'chalk';

import db from '../database.js';

dotenv.config();

export async function detailsUrlsUser(req, res){
    const {id} = req.params;
    console.log('id do usuario', id);

    try {
        
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}

export async function getRanking(req, res){
    try {
        
    } catch (error) {
        console.log(chalk.red(error));
        res.sendStatus(500);
    }
}
