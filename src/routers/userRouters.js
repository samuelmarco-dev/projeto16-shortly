import { Router } from 'express';

import { signInUser, signUpUser } from '../controllers/userControllers.js';
import { userExistsEmail, validateSchemaSignUp } from '../middlewares/signUpMiddleware.js';
import { loginPermission, validateSchemaSignIn } from '../middlewares/signInMiddleware.js';

const userRouter = Router();

userRouter.post('/sign-up', validateSchemaSignUp, userExistsEmail, signUpUser);
userRouter.post('/sign-in', validateSchemaSignIn, loginPermission, signInUser);

export default userRouter;