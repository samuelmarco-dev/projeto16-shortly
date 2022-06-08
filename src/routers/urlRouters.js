import { Router } from "express";

import { 
    createShortUrlUser, getShortUrl, getShortUrlRedirect, deleteShortUrlUser 
} from "../controllers/urlControllers.js";

const urlRouter = Router();

urlRouter.post('/urls/shorten', createShortUrlUser);
urlRouter.get('/urls/:id', getShortUrl);
urlRouter.get('/urls/open/:shortUrl', getShortUrlRedirect);
urlRouter.delete('/urls/:id', deleteShortUrlUser);

export default urlRouter;