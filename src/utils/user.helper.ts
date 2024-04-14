import bcrypt from "bcrypt";

import db from "./db";

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { name, email, hashedPassword },
    });
    return user;
  } catch (error: any) {
    console.log("[CREATE_USER_ERROR]");
    throw Error(error.message);
  }
};
