import { Router } from "express";

import userRouter from "./userRouters.js";
import urlRouter from "./urlRouters.js";
import rankingRouter from "./rankingRouters.js";

const appRouter = Router();

appRouter.use(userRouter);
appRouter.use(urlRouter);
appRouter.use(rankingRouter);

export default appRouter;