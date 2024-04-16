import { Request, Response } from "express";
import db from "../utils/db";
import {
  generateShortenUrl,
  getUrlById,
  longUrlExists,
  shortUrlExists,
} from "../utils/url.helper";

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

export async function redirectToLongUrl(req: Request, res: Response) {
  try {
    var shortUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    const urlObject = await shortUrlExists(undefined, shortUrl);
    if (!urlObject) {
      return res.status(404).redirect("/not-found");
    }
    res.redirect(urlObject.longUrl);
  } catch (err: any) {
    console.log("[REDIRECT_CONTROLLER_ERROR] : ", err.message);
    res.status(500).send({ message: "Server error." });
  }
}

export async function getUserUrls(req: any, res: Response) {
  try {
    const urls = await db.url.findMany({
      where: {
        userId: req.user.id,
      },
    });
    res.status(200).send({ urls });
  } catch (err: any) {
    console.log("[GET_USER_URLS_CONTROLLER_ERROR] : ", err.message);
    res.status(500).send({ message: "Server error." });
  }
}

export async function deleteUrl(req: Request, res: Response) {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).send({ message: "Url idis required. " });
    if (id.length !== 24)
      return res.status(400).send({ message: "Url id is invalid. " });

    const url = await getUrlById(id as string);
    if (!url) return res.status(400).send({ message: "Url does not exist." });
    await db.url.delete({ where: { id: id as string } });
    res.status(200).send({ url });
  } catch (err: any) {
    console.log("[DELETE_URL_CONTROLLER_ERROR] : ", err.message);
    res.status(500).send({ message: "Server error." });
  }
}
