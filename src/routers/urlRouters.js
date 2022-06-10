import { Router } from "express";

import { 
    createShortUrlUser, getShortUrl, getShortUrlRedirect, deleteShortUrlUser 
} from "../controllers/urlControllers.js";
import { authorizationToken } from "../middlewares/authToken.js";
import { validateRelationUrl, validateSchemaUrl } from "../middlewares/createUrlMiddleware.js";

const urlRouter = Router();

urlRouter.post('/urls/shorten', validateSchemaUrl, authorizationToken, validateRelationUrl, createShortUrlUser);
urlRouter.get('/urls/:id', getShortUrl);
urlRouter.get('/urls/open/:shortUrl', getShortUrlRedirect);
urlRouter.delete('/urls/:id', deleteShortUrlUser);

export default urlRouter;