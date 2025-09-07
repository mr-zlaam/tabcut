import { allowedExtensions } from "../constant/browser-executable-list";
import chalk from "chalk";
export function validateIconUrl(url: string): boolean | string {
  const lower = url.toLowerCase();
  if (!(lower.startsWith("http://") || lower.startsWith("https://"))) {
    return "❌ Must be a valid URL starting with http/https.";
  }
  if (!allowedExtensions.some((ext) => lower.endsWith(ext))) {
    return "❌ URL must end with .png, .svg, or .jpeg.";
  }
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    console.log(
      chalk.yellow("⚠️ JPG/JPEG is supported but not recommended. Transparency will be lost.")
    );
  }
  return true;
}

