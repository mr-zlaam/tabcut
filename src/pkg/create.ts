import { confirm, input, rawlist } from "@inquirer/prompts";
import { randomUUIDv7 } from "bun";
import chalk from "chalk";
import { z } from "zod";
import { isValidUrl } from "../utils/checkValidUrl";
import { detectInstalledBrowsers } from "../utils/detectBrowsers";
import { fetchFavicon } from "../utils/fetchAndSaveIcons";
import { createDesktopEntry } from "../utils/createDesktopEntry";
import slugify from "slugify";
import fs from "fs";
import { generateSlug } from "../utils/slugStringGeneratorUtils";

const retryPrompt = async <T>(
  promptFn: () => Promise<T>,
  validate: (value: T) => boolean | string
): Promise<T> => {
  while (true) {
    const result = await promptFn();
    const validation = validate(result);
    if (validation === true) return result;
    console.log(chalk.red(typeof validation === "string" ? validation : "❌ Invalid input. Try again."));
  }
};

export const CreateTabCut = async () => {
  const nameSchema = z.string().min(1);
  const categorySchema = z.string().min(1);
  const urlSchema = z.url();

  const applicationName = await retryPrompt(
    () => input({ message: chalk.cyan("📛 Enter name of your application:") }),
    (value) => nameSchema.safeParse(value).success || "❌ Name cannot be empty."
  );

  const url = await retryPrompt(
    () => input({ message: chalk.cyan("🔗 Enter valid URL of the site:") }),
    (value) =>
      urlSchema.safeParse(value).success && isValidUrl(value)
        ? true
        : "❌ Invalid URL (must include http/https)"
  );

  const category = await retryPrompt(
    () => input({ message: chalk.cyan("🗂️  Enter categories your application falls in:") }),
    (value) => categorySchema.safeParse(value).success || "❌ Category cannot be empty."
  );

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

  const useCustomIcon = await confirm({
    message: chalk.yellow("🖼️  Do you want to provide a custom PNG icon?"),
  });

  const slug = slugify(applicationName, { lower: true, strict: true });
  let iconPath: string | null = null;

  if (useCustomIcon) {
    iconPath = await retryPrompt(
      () => input({ message: chalk.cyan("📁 Enter full path to your .png icon:") }),
      (val) =>
        fs.existsSync(val) && val.endsWith(".png")
          ? true
          : "❌ File must exist and be a .png image."
    );
  } else {
    iconPath = await fetchFavicon(url, slug);
    if (!iconPath) {
      console.log(chalk.red("❌ Could not fetch icon. Please use custom PNG."));
      process.exit(1);
    }
  }

  await createDesktopEntry({
    name: applicationName,
    slug: `mr-zlaam-${generateSlug(applicationName) + randomUUIDv7().split("-")[0]}`,
    url,
    category,
    browserCmd: browser,
    iconPath,
    private: privateMode,
    isolated: isIsolatedProfile,
    customParams,
  });

  console.log(chalk.green("✅ Webapp created successfully!"));
};
