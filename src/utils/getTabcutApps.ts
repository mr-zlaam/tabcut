import fs from "fs";
import path from "path";
import os from "os";

export interface TabcutApp {
  name: string;
  slug: string;
  icon: string;
  browser: string;
  url: string;
  filePath: string;
  desktopContent: string;
  privateWindow: boolean;
  isolated: boolean;
  customParams?: string;
}

const parseDesktopEntry = (content: string): Partial<TabcutApp> => {
  const lines = content.split("\n").map((l) => l.trim());
  const getValue = (key: string) => {
    const line = lines.find((l) => l.startsWith(`${key}=`));
    return line ? line.replace(`${key}=`, "").trim() : undefined;
  };

  return {
    name: getValue("Name") || "Unnamed",
    icon: getValue("Icon") || "",
    browser: getValue("X-WebApp-Browser") || "",
    url: getValue("X-WebApp-URL") || "",
    privateWindow: getValue("X-WebApp-PrivateWindow") === "true",
    isolated: getValue("X-WebApp-Isolated") === "true",
    customParams: getValue("X-WebApp-CustomParameters") || undefined,
  };
};

export const getTabcutApps = (): TabcutApp[] => {
  const appsDir = path.join(os.homedir(), ".local", "share", "applications");
  const files = fs.readdirSync(appsDir);

  const tabcutFiles = files.filter((f) => f.startsWith("mr-zlaam-") && f.endsWith(".desktop"));

  const results: TabcutApp[] = [];

  for (const file of tabcutFiles) {
    const fullPath = path.join(appsDir, file);
    const content = fs.readFileSync(fullPath, "utf-8");

    const parsed = parseDesktopEntry(content);

    const slug = path.basename(file, ".desktop");

    results.push({
      name: parsed.name!,
      slug,
      icon: parsed.icon!,
      browser: parsed.browser!,
      url: parsed.url!,
      privateWindow: parsed.privateWindow ?? false,
      isolated: parsed.isolated ?? false,
      customParams: parsed.customParams,
      filePath: fullPath,
      desktopContent: content,
    });
  }

  return results;
};
