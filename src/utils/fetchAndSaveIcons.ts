import fs from "fs";
import path from "path";
import https from "https";
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";
import chalk from "chalk";

const HOME = process.env.HOME || "~";
const ICON_DIR = path.join(HOME, ".local", "share", "tabcut", "icons");

export async function fetchFavicon(
  siteUrl: string,
  slug: string,
  controller?: AbortController
): Promise<string | null> {
  try {
    const url = new URL(siteUrl);
    const faviconUrl = `${url.origin}/favicon.ico`;
    const destPath = path.join(ICON_DIR, `${slug}.png`);

    if (!fs.existsSync(ICON_DIR)) fs.mkdirSync(ICON_DIR, { recursive: true });

    await new Promise<void>((resolve, reject) => {
      const req = https.get(
        faviconUrl,
        { signal: controller?.signal },
        (res) => {
          if (res.statusCode !== 200)
            return reject(new Error(`Failed: ${res.statusCode}`));
          const stream = createWriteStream(destPath);
          pipeline(res, stream).then(resolve).catch(reject);
        }
      );
      req.on("error", reject);
      controller?.signal.addEventListener("abort", () => req.destroy());
    });

    return destPath;
  } catch {
    return null;
  }
}
