import express from "express";
import * as dotenv from "dotenv";
import type { Express as ExpressType } from "express";
import authRouter from "./routes/auth.routes";
import urlRouter from "./routes/url.routes";
import { authenticateUser } from "./middlewares/auth.middleware";

dotenv.config();

if (!process.env.PORT) {
  process.exit();
}

const app: ExpressType = express();

app.use(express.json());

app.get("/", async (req, res) => {
  res.send({ message: "This is a Response." });
});
app.get("/protected", authenticateUser, async (req: any, res) => {
  res.send({ message: "This is a protected and user specific response." });
});

app.use("/auth", authRouter);
app.use("/", urlRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT} .`);
});
