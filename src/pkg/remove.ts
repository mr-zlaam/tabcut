import { getTabcutApps } from "../utils/getTabcutApps";
import chalk from "chalk";
import fs from "fs";
import os from "os";
import path from "path";
import { checkbox } from "@inquirer/prompts";

const ICON_DIR = path.join(os.homedir(), ".local", "share", "tabcut", "icons");

export async function removeTabcutApps() {
  const apps = getTabcutApps();

  if (!apps.length) {
    console.log(chalk.yellow("⚠️  No web apps created by tabcut found."));
    return;
  }

  const choices = apps.map((app) => ({
    name: `${app.name} (${app.url})`,
    value: app.slug,
  }));

  const selectedSlugs = await checkbox({
    message: chalk.redBright("❌ Select apps to remove:"),
    choices,
  });

  if (!selectedSlugs.length) {
    console.log(chalk.gray("No apps selected. Exiting."));
    return;
  }

  let removed = 0;

  for (const slug of selectedSlugs) {
    const app = apps.find((a) => a.slug === slug);
    if (!app) continue;

    try {
      // Remove .desktop file
      fs.unlinkSync(app.filePath);
      removed++;

      // Remove icon if inside ICON_DIR
      if (app.icon.startsWith(ICON_DIR)) {
        try {
          fs.unlinkSync(app.icon);
        } catch {
          console.log(chalk.gray(`⚠️  Icon already missing: ${app.icon}`));
        }
      }

      console.log(chalk.green(`✔ Removed: ${app.name}`));
    } catch (err) {
      console.log(chalk.red(`❌ Failed to remove ${app.name}: ${err}`));
    }
  }

  if (removed > 0) {
    console.log(chalk.cyanBright(`\n🧹 ${removed} app(s) removed.`));
  }
}
