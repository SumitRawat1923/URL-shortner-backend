import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import type { Express as ExpressType } from "express";
import authRouter from "./routes/auth.routes";
import urlRouter from "./routes/url.routes";
import { authenticateUser } from "./middlewares/auth.middleware";
import { getCountryName } from "./utils/url.helper";

dotenv.config();

if (!process.env.PORT) {
  process.exit();
}

const app: ExpressType = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.send({ message: "This is a Response." });
});
app.get("/protected", authenticateUser, async (req: any, res) => {
  res.send({
    message: "This is a protected and user specific response.",
    user: req.user,
  });
});

app.use("/auth", authRouter);
app.use("/url", urlRouter);

app.get("/test", (req, res) => {
  getCountryName();
  res.send("Response");
});
app.use(function (req, res, next) {
  res.status(404).send("Sorry, the page you are looking for does not exist.");
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT} .`);
});
