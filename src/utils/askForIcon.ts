import chalk from "chalk";
import { rawlist, input } from "@inquirer/prompts";
import { validateIconUrl } from "./validateIconUrl";
import { downloadIconFromUrl, fetchFavicon } from "./fetchAndSaveIcons";
import { validateIconPath } from "./validateIconPath";
import ora from "ora";
export async function askForIcon(slug: string, url: string): Promise<string | null> {
  while (true) {
    const choice = await rawlist({
      message: chalk.cyan("Choose how to set the app icon:"),
      choices: [
        { name: "Provide an online URL", value: "online" },
        { name: "Provide a local icon file", value: "local" },
        { name: "Try automatic favicon fetch", value: "favicon" },
        { name: "Skip and continue without icon", value: "skip" },
      ],
    });

    if (choice === "online") {
      const onlineIconUrl = await input({ message: chalk.cyan("Enter direct image URL:") });
      const validation = validateIconUrl(onlineIconUrl);
      if (validation === true) {
        const downloaded = await downloadIconFromUrl(onlineIconUrl, slug);
        if (downloaded) return downloaded;
        console.log(chalk.red("❌ Failed to download icon."));
      } else {
        console.log(chalk.red(validation as string));
      }
      continue; // go back to 4-option menu
    }

    if (choice === "local") {
      const localPath = await input({ message: chalk.cyan("Enter full path to your icon:") });
      const validation = validateIconPath(localPath);
      if (validation === true) {
        return localPath;
      } else {
        console.log(chalk.red(validation as string));
      }
      continue; // go back to 4-option menu
    }

    if (choice === "favicon") {
      const spinner = ora("Fetching favicon...").start();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);
      let iconPath: string | null = null;
      try {
        iconPath = await fetchFavicon(url, slug, controller);
      } catch {
        iconPath = null;
      } finally {
        clearTimeout(timeout);
        spinner.stop();
      }

      if (iconPath) return iconPath;
      console.log(chalk.red("❌ Favicon fetch failed."));
      continue; // go back to 4-option menu
    }

    if (choice === "skip") return null;
  }
}
