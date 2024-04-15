import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { createShortenUrl } from "../controllers/url.controller";

const urlRouter = Router();

urlRouter.post("/url/create-short-url", authenticateUser, createShortenUrl);

export default urlRouter;
