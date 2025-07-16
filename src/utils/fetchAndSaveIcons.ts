import fs from "fs";
import path from "path";
import https from "https";
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";

const HOME = process.env.HOME || "~";
const ICON_DIR = path.join(HOME, ".local", "share", "tabcut", "icons");

export async function fetchFavicon(
  siteUrl: string,
  slug: string,
  controller?: AbortController
): Promise<string | null> {
  const destPath = path.join(ICON_DIR, `${slug}.png`);
  const url = new URL(siteUrl);
  const faviconUrl = `${url.origin}/favicon.ico`;

  if (!fs.existsSync(ICON_DIR)) fs.mkdirSync(ICON_DIR, { recursive: true });

  try {
    await new Promise<void>((resolve, reject) => {
      const req = https.get(
        faviconUrl,
        { signal: controller?.signal },
        (res) => {
          if (
            res.statusCode !== 200 ||
            !res.headers["content-type"]?.includes("image")
          ) {
            return reject(new Error("No image found"));
          }
          const stream = createWriteStream(destPath);
          pipeline(res, stream).then(resolve).catch(reject);
        }
      );
      req.on("error", reject);
      controller?.signal?.addEventListener("abort", () => req.destroy());
    });

    return destPath;
  } catch {
    return null;
  }
}

export async function downloadIconFromUrl(
  iconUrl: string,
  slug: string
): Promise<string | null> {
  const destPath = path.join(ICON_DIR, `${slug}.png`);

  try {
    await new Promise<void>((resolve, reject) => {
      https
        .get(iconUrl, (res) => {
          if (
            res.statusCode !== 200 ||
            !res.headers["content-type"]?.includes("image")
          ) {
            return reject(new Error("Invalid image"));
          }

          const stream = createWriteStream(destPath);
          pipeline(res, stream).then(resolve).catch(reject);
        })
        .on("error", reject);
    });

    return destPath;
  } catch {
    return null;
  }
}
