import { Router } from "express";

import { detailsUrlsUser, getRanking } from "../controllers/rankingControllers.js";
import { tokenInDetailsUser } from "../middlewares/authTokenDetails.js";
import { countViewsUser, resultRankingUsers } from "../middlewares/rankingMiddleware.js";

const rankingRouter = Router();

rankingRouter.get('/users/:id', tokenInDetailsUser, countViewsUser, detailsUrlsUser);
rankingRouter.get('/ranking', resultRankingUsers, getRanking);

export default rankingRouter;