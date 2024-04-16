import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import {
  createShortenUrl,
  getUserUrls,
  redirectToLongUrl,
} from "../controllers/url.controller";

const urlRouter = Router();

urlRouter.post("/create-short-url", authenticateUser, createShortenUrl);


urlRouter.get("/user-urls", authenticateUser, getUserUrls);

urlRouter.get("/test", (req, res) => {
  res.send({ message: "Response" });
});

urlRouter.get("/:id", redirectToLongUrl);
export default urlRouter;
