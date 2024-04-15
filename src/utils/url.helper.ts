import { randomBytes } from "crypto";
import db from "./db";

async function shortUrlExists(userId: string, shortUrl: string) {
  try {
    const url = await db.url.findFirst({ where: { userId, shortUrl } });
    return url;
  } catch (err: any) {
    console.error("[URL_HELPER_ERROR] : ", err.message);
    throw new Error("Unable to check if shortUrl exists.");
  }
}

export async function longUrlExists(userId: string, longUrl: string) {
  try {
    const url = await db.url.findFirst({ where: { userId, longUrl } });
    return url;
  } catch (err: any) {
    console.error("[URL_HELPER_ERROR] : ", err.message);
    throw new Error("Unable to check if longUrl exists.");
  }
}

export async function generateShortenUrl(
  userId: string,
  longUrl: string
): Promise<string> {
  let shortUrl: string | undefined;

  while (!shortUrl) {
    const randomString = randomBytes(3).toString("hex");
    shortUrl = `${process.env.BACKEND_URL as string}/${randomString}`;
    const exists = await shortUrlExists(userId, shortUrl);
    if (exists) {
      shortUrl = undefined;
    }
  }

  return shortUrl;
}
