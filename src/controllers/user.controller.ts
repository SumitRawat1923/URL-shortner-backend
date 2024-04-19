import { Response, Request } from "express";
import { createUser, findUserByEmail } from "../utils/user.helper";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { User } from "@prisma/client";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ message: "Bad request." });
    }

    let user: any = await findUserByEmail(email);

    if (user) return res.status(400).send({ message: "User already exists." });

    user = await createUser(name, email, password);

    const jwtToken = sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: "1d",
    });
    res.cookie("jwt_auth_token", jwtToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
    });
    res.status(200).send({ user });
  } catch (err: any) {
    console.log(`[USER_CONTROLLER_REGISTER_ERROR] : ${err.message}`);
    res.status(500).send({ message: "Server error." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Bad request." });
    }

    let user: User | null | undefined = await findUserByEmail(email);
    if (!user) return res.status(404).send({ message: "User not found." });

    const passswordsMatch = await compare(password, user.hashedPassword);
    if (!passswordsMatch)
      return res.status(401).send({ message: "Incorrect password." });

    const userObject = { id: user.id, name: user.name, email: user.email };

    const jwtToken = sign(
      userObject,
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );
    res.cookie("jwt_auth_token", jwtToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
    });

    res.status(200).send({ userObject });
  } catch (err: any) {
    console.log("[USER_CONTROLLER_LOGIN_ERROR] : ", err.message);
    res.status(500).send({ message: "Server error." });
  }
};
