import {Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export const authenticateUser = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "Token is required." });
    }

    verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
      if (err) {
        console.error("[AUTH_MIDDLEWARE_ERROR] : ", err.message);
        return res.status(401).json({ message: "Unauthorized." });
      }
      req.user = user;
      next();
    });
  } catch (err: any) {
    console.error("[AUTH_MIDDLEWARE_ERROR] : ", err.message);
    res.status(500).json({ message: "Server error." });
  }
};
