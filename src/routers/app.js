import { Router } from "express";

import userRouter from "./userRouters.js";

const appRouter = Router();

appRouter.use(userRouter);

export default appRouter;