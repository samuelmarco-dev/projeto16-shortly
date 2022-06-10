import { Router } from "express";

import { 
    createShortUrlUser, getShortUrl, getShortUrlRedirect, deleteShortUrlUser 
} from "../controllers/urlControllers.js";
import { authorizationToken } from "../middlewares/authToken.js";
import { validateRelationUrl, validateSchemaUrl } from "../middlewares/createUrlMiddleware.js";
import { validateRelacionDeleteUrl } from "../middlewares/deleteUrlMiddleware.js";
import { filterUrlById, updateSelectViews } from "../middlewares/getUrlMiddleware.js";

const urlRouter = Router();

urlRouter.post('/urls/shorten', validateSchemaUrl, authorizationToken, validateRelationUrl, createShortUrlUser);
urlRouter.get('/urls/:id', filterUrlById, getShortUrl);
urlRouter.get('/urls/open/:shortUrl', updateSelectViews, getShortUrlRedirect);
urlRouter.delete('/urls/:id', authorizationToken, validateRelacionDeleteUrl, deleteShortUrlUser);

export default urlRouter;