
import { exec } from "child_process";
import { promisify } from "util";
import { browserExecutables } from "../constant/browser-executable-list";

const execAsync = promisify(exec);

// Optional: Provide friendly display names (fallback to executable name if missing)
const displayNames: Record<string, string> = {
  "google-chrome": "Google Chrome",
  "chromium": "Chromium",
  "brave-browser": "Brave",
  "microsoft-edge": "Microsoft Edge",
  opera: "Opera",
  vivaldi: "Vivaldi",

  "ungoogled-chromium": "Ungoogled Chromium",
  thorium: "Thorium",
  iridium: "Iridium",
  bromite: "Bromite",
  vanadium: "Vanadium",

  "dissenter-browser": "Dissenter",
  kiwi: "Kiwi Browser",
  "yandex-browser": "Yandex",
  "naver-whale": "Whale",
  slimjet: "Slimjet",
  falkon: "Falkon",

  firefox: "Firefox",
  librewolf: "LibreWolf",
  waterfox: "Waterfox",
  "pale-moon": "Pale Moon",
  seamonkey: "SeaMonkey",
  icecat: "GNU IceCat",

  epiphany: "Epiphany",
  midori: "Midori",
  konqueror: "Konqueror",
  qutebrowser: "QuteBrowser",
  surf: "surf",
  nyxt: "Nyxt",
};

export async function detectInstalledBrowsers(): Promise<
  { cmd: string; name: string }[]
> {
  const result: { cmd: string; name: string }[] = [];

  for (const cmd of browserExecutables) {
    try {
      await execAsync(`which ${cmd}`);
      result.push({ cmd, name: displayNames[cmd] || cmd });
    } catch {
      // Not found — ignore
    }
  }

  return result;
}
