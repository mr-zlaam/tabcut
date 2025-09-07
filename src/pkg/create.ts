import { confirm, input, rawlist } from "@inquirer/prompts";
import { randomUUIDv7 } from "bun";
import chalk from "chalk";
import { z } from "zod";
import slugify from "slugify";

import { isValidUrl } from "../utils/checkValidUrl";
import { detectInstalledBrowsers } from "../utils/detectBrowsers";
import { createDesktopEntry } from "../utils/createDesktopEntry";
import { generateSlug } from "../utils/slugStringGeneratorUtils";
import { askForIcon } from "../utils/askForIcon";
import { retryPrompt } from "../utils/retryPrompt";




export const CreateTabCut = async () => {
  const nameSchema = z.string().min(1);
  const categorySchema = z.string().min(1);
  const urlSchema = z.url();

  const applicationName = await retryPrompt(
    () => input({ message: chalk.cyan(" Enter name of your application:") }),
    (value) => nameSchema.safeParse(value).success || "❌ Name cannot be empty."
  );
  const url = await retryPrompt(
    () => input({ message: chalk.cyan(" Enter valid URL of the site:") }),
    (value) =>
      urlSchema.safeParse(value).success && isValidUrl(value)
        ? true
        : "❌ Invalid URL (must include http/https)"
  );

  const category = await retryPrompt(
    () =>
      input({ message: chalk.cyan("Enter categories your application falls in:") }),
    (value) =>
      categorySchema.safeParse(value).success || "❌ Category cannot be empty."
  );

  const detected = await detectInstalledBrowsers();
  if (!detected.length) {
    console.log(chalk.red("❌ No supported browsers found."));
    process.exit(1);
  }

  const browser = await rawlist({
    message: chalk.cyan(" Select browser to run the app with:"),
    choices: detected.map(({ name, cmd }) => ({
      name: `${name} (${cmd})`,
      value: cmd,
    })),
  });

  const customParams = await input({
    message: chalk.cyan("  Enter any custom launch parameters (or leave blank):"),
  });

  const isIsolatedProfile = await confirm({
    message: chalk.yellow(" Do you want an isolated profile?"),
  });


  const privateMode = await confirm({
    message: chalk.yellow(" Do you want Private/Incognito Window?"),
  });

  const slug = slugify(applicationName, { lower: true, strict: true });
  const iconPath = await askForIcon(slug, url);

  // 🛑 Single final confirmation
  const proceed = await confirm({
    message: chalk.cyan(
      iconPath
        ? "✔ Icon resolved successfully. Do you want to create the webapp now?"
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

  console.log(chalk.green("✔ Webapp created successfully!"));
};
