import express from "express";
import * as dotenv from "dotenv";
import type { Express as ExpressType } from "express";
import authRouter from "./routes/auth.routes";
import { createUser } from "./utils/user.helper";

dotenv.config();

if (!process.env.PORT) {
  process.exit();
}

const app: ExpressType = express();

app.use(express.json());

app.get("/", async (req, res) => {
  res.send({ message: "This is a Response." });
});

app.use("/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT} .`);
});
