import { Router } from "express";

import { detailsUrlsUser, getRanking } from "../controllers/rankingControllers.js";
import { tokenInDetailsUser } from "../middlewares/authTokenDetails.js";

const rankingRouter = Router();

rankingRouter.get('/users/:id', tokenInDetailsUser, detailsUrlsUser);
rankingRouter.get('/ranking', getRanking);

export default rankingRouter;