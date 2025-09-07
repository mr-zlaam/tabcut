import { confirm, input, rawlist } from "@inquirer/prompts";
import { randomUUIDv7 } from "bun";
import chalk from "chalk";
import { z } from "zod";
import fs from "fs";
import ora from "ora";
import slugify from "slugify";

import { isValidUrl } from "../utils/checkValidUrl";
import { detectInstalledBrowsers } from "../utils/detectBrowsers";
import { fetchFavicon, downloadIconFromUrl } from "../utils/fetchAndSaveIcons";
import { createDesktopEntry } from "../utils/createDesktopEntry";
import { generateSlug } from "../utils/slugStringGeneratorUtils";

const allowedExtensions = [".png", ".svg", ".jpeg", ".jpg"];

function validateIconPath(path: string): boolean | string {
  if (!fs.existsSync(path)) return "❌ File does not exist.";
  const lower = path.toLowerCase();
  if (!allowedExtensions.some((ext) => lower.endsWith(ext))) {
    return "❌ File must be a .png, .svg, or .jpeg image.";
  }
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    console.log(
      chalk.yellow("⚠️ JPG/JPEG is supported but not recommended. Transparency will be lost.")
    );
  }
  return true;
}

function validateIconUrl(url: string): boolean | string {
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

async function askForIcon(slug: string, url: string): Promise<string | null> {
  while (true) {
    const choice = await rawlist({
      message: chalk.cyan("🎨 Choose how to set the app icon:"),
      choices: [
        { name: "🌐 Provide an online URL", value: "online" },
        { name: "📁 Provide a local icon file", value: "local" },
        { name: "✨ Try automatic favicon fetch", value: "favicon" },
        { name: "🚀 Skip and continue without icon", value: "skip" },
      ],
    });

    if (choice === "online") {
      const onlineIconUrl = await input({ message: chalk.cyan("🔗 Enter direct image URL:") });
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
      const localPath = await input({ message: chalk.cyan("📁 Enter full path to your icon:") });
      const validation = validateIconPath(localPath);
      if (validation === true) {
        return localPath;
      } else {
        console.log(chalk.red(validation as string));
      }
      continue; // go back to 4-option menu
    }

    if (choice === "favicon") {
      const spinner = ora("🎨 Fetching favicon...").start();
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

export const CreateTabCut = async () => {
  const nameSchema = z.string().min(1);
  const categorySchema = z.string().min(1);
  const urlSchema = z.url();

  const applicationName = await input({
    message: chalk.cyan("📛 Enter name of your application:"),
  });
  if (!nameSchema.safeParse(applicationName).success) {
    console.log(chalk.red("❌ Name cannot be empty."));
    return;
  }

  const url = await input({ message: chalk.cyan("🔗 Enter valid URL of the site:") });
  if (!(urlSchema.safeParse(url).success && isValidUrl(url))) {
    console.log(chalk.red("❌ Invalid URL (must include http/https)."));
    return;
  }

  const category = await input({
    message: chalk.cyan("🗂️  Enter categories your application falls in:"),
  });
  if (!categorySchema.safeParse(category).success) {
    console.log(chalk.red("❌ Category cannot be empty."));
    return;
  }

  const detected = await detectInstalledBrowsers();
  if (!detected.length) {
    console.log(chalk.red("❌ No supported browsers found."));
    process.exit(1);
  }

  const browser = await rawlist({
    message: chalk.cyan("🌐 Select browser to run the app with:"),
    choices: detected.map(({ name, cmd }) => ({
      name: `${name} (${cmd})`,
      value: cmd,
    })),
  });

  const customParams = await input({
    message: chalk.cyan("⚙️  Enter any custom launch parameters (or leave blank):"),
  });

  const isIsolatedProfile = await confirm({
    message: chalk.yellow("🧍 Do you want an isolated profile?"),
  });

  const privateMode = await confirm({
    message: chalk.yellow("🕵️ Do you want Private/Incognito Window?"),
  });

  const slug = slugify(applicationName, { lower: true, strict: true });
  const iconPath = await askForIcon(slug, url);

  // 🛑 Single final confirmation
  const proceed = await confirm({
    message: chalk.cyan(
      iconPath
        ? "✅ Icon resolved successfully. Do you want to create the webapp now?"
        : "⚠️ No icon selected. Do you still want to create the webapp?"
    ),
    default: true,
  });

  if (!proceed) {
    console.log(chalk.yellow("❌ Webapp creation cancelled by user."));
    return;
  }

  try {
    await createDesktopEntry({
      name: applicationName,
      slug: `mr-zlaam-${generateSlug(applicationName) + randomUUIDv7().split("-")[0]}`,
      url,
      category,
      browserCmd: browser,
      iconPath: iconPath || "",
      private: privateMode,
      isolated: isIsolatedProfile,
      customParams,
    });
  } catch {
    console.log(chalk.red("⚠️ Failed to copy icon, but continuing..."));
  }

  console.log(chalk.green("✅ Webapp created successfully!"));
};
