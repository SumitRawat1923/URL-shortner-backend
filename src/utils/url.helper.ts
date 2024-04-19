import { randomBytes } from "crypto";
import db from "./db";
import { lookup } from "geoip-lite";
import { whereAlpha2 as getCountry } from "iso-3166-1";
import { subdivision as getState } from "iso-3166-2";
export async function shortUrlExists(
  userId: string | undefined = undefined,
  shortUrl: string
) {
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
    shortUrl = `${process.env.BACKEND_URL as string}/url/${randomString}`;
    const exists = await shortUrlExists(userId, shortUrl);
    if (exists) {
      shortUrl = undefined;
    }
  }

  return shortUrl;
}

export async function getUrlById(id: string) {
  try {
    const url = await db.url.findUnique({ where: { id } });
    return url;
  } catch (err: any) {
    console.log("[URL_HELPER_ERROR] : ", err);
    return null;
  }
}

export function extractGeoInfo(ipv4: string): any {
  const geo = lookup(ipv4);

  const geoObject: any = {
    ipAddress: ipv4,
    country: "",
    city: "",
    latitude: 0,
    longitude: 0,
  };

  if (geo) {
    const { country, city, ll } = geo;
    const [latitude, longitude] = ll;

    geoObject.city = getStateName(city);
    geoObject.country = getCountryName(country);
    geoObject.latitude = latitude;
    geoObject.longitude = longitude;
    return geoObject;
  } else {
    return geoObject;
  }
}

export function extractSiteName(url: string) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (err) {
    return url;
  }
}

export function getCountryName(isoCode: string = "") {
  return getCountry(isoCode);
}

export function getStateName(isoCode: string = "") {
  return getState(isoCode);
}
