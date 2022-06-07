import express, {json} from 'express';
import cors from 'cors';
import morgan from 'morgan';

import dotenv from 'dotenv';
import chalk from 'chalk';

import userRouter from './routers/usersRouter.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(json());
app.use(morgan('dev'));

app.use(userRouter);

const port = 4000 || process.env.PORT;
app.listen(port, ()=>{
    console.log(chalk.green(`Server is running on port ${port}`));
});
