import { Response } from "express";
import db from "../utils/db";
import { generateShortenUrl, longUrlExists } from "../utils/url.helper";

export async function createShortenUrl(req: any, res: Response) {
  try {
    const { url } = req.body;
    const user = req.user;

    if (!url) {
      return res.status(400).json({ error: "Url is required." });
    }

    const urlAlreadyExists = await longUrlExists(user.id, url);
    if (urlAlreadyExists) {
      return res.status(200).json({ message: "ShortUrl already exists." });
    }

    const shortUrl = await generateShortenUrl(user.id, url);
    const urlObject = await db.url.create({
      data: {
        longUrl: url,
        shortUrl,
        user: { connect: { id: user.id } },
      },
    });

    return res.status(200).json({ urlObject });
  } catch (err: any) {
    console.error("[URL_ROUTES_ERROR]:", err.message);
    res.status(500).json({ error: "Server error." });
  }
}
