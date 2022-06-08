import { Router } from "express";

import userRouter from "./userRouters.js";
import urlRouter from "./urlRouters.js";

const appRouter = Router();

appRouter.use(userRouter);
appRouter.use(urlRouter);

export default appRouter;