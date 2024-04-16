import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import {
  createShortenUrl,
  deleteUrl,
  getUserUrls,
  redirectToLongUrl,
} from "../controllers/url.controller";

const urlRouter = Router();

//Endpoint to create a shortUrl
urlRouter.post("/create-short-url", authenticateUser, createShortenUrl);

//Endpoint to fetch all the URLs related to a particular user.
urlRouter.get("/user", authenticateUser, getUserUrls);

//Endpoint to delete a particular Url
urlRouter.delete("/user", authenticateUser, deleteUrl);

//Endpoint to handle redirects
urlRouter.get("/:id", redirectToLongUrl);
export default urlRouter;
