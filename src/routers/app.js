import { Router } from "express";

import userRouter from "./usersRouter.js";

const appRouter = Router();

appRouter.use(userRouter);

export default appRouter;