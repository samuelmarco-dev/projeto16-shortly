import { Router } from 'express';

import { signInUser, signUpUser } from '../controllers/userControllers.js';

const userRouter = Router();

userRouter.post('/sign-up', signUpUser);
userRouter.post('/sign-in', signInUser);

export default userRouter;