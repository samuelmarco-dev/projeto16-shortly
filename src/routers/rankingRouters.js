import { Router } from "express";

import { detailsUrlsUser, getRanking } from "../controllers/rankingControllers.js";

const rankingRouter = Router();

rankingRouter.get('/users/:id', detailsUrlsUser);
rankingRouter.get('/ranking', getRanking);

export default rankingRouter;