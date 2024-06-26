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
      select: {
        name: true,
        email: true,
        id: true,
      },
    });
    return user;
  } catch (error: any) {
    console.log("[CREATE_USER_ERROR]");
    throw Error(error.message);
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (user) return user;
    return null;
  } catch (err: any) {
    console.log("[UTILS_USER_HELPER] : ", err.message);
  }
};