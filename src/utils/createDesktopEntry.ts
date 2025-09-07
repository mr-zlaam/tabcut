import fs, { copyFileSync } from "fs";
import path from "path";
import chalk from "chalk";

interface DesktopEntryOptions {
  name: string;
  slug: string;
  url: string;
  category: string;
  browserCmd: string;
  iconPath: string;
  private: boolean;
  isolated: boolean;
  customParams?: string;
}

export async function createDesktopEntry(options: DesktopEntryOptions) {
  const HOME = process.env.HOME || "~";

  const APPLICATIONS_DIR = path.join(HOME, ".local", "share", "applications");
  const ICON_DIR = path.join(HOME, ".local", "share", "webapps", "icons");

  // Ensure dirs exist
  fs.mkdirSync(APPLICATIONS_DIR, { recursive: true });
  fs.mkdirSync(ICON_DIR, { recursive: true });

  // Define icon target path
  const finalIconPath = path.join(ICON_DIR, `${options.slug}.png`);
  let iconEntry = "";

  if (options.iconPath && fs.existsSync(options.iconPath)) {
    if (path.resolve(options.iconPath) !== path.resolve(finalIconPath)) {
      try {
        copyFileSync(options.iconPath, finalIconPath);
        iconEntry = finalIconPath;
      } catch {
        console.log(
          chalk.yellow("⚠️ Could not copy icon file. Continuing without it.")
        );
      }
    } else {
      iconEntry = finalIconPath;
    }
  }

  const desktopFilePath = path.join(
    APPLICATIONS_DIR,
    `${options.slug}.desktop`
  );
  const wmClass = `WebApp-${options.slug}`;
  const execCommand = [
    options.browserCmd,
    `--app="${options.url}"`,
    `--class=${wmClass}`,
    `--name=${wmClass}`,
  ];

  if (options.private) execCommand.push("--incognito");

  if (options.isolated) {
    const profilePath = path.join(HOME, `.config/webapps/${options.slug}`);
    execCommand.push(`--user-data-dir=${profilePath}`);
  }

  if (options.customParams) execCommand.push(options.customParams);

  const entryContent = `
[Desktop Entry]
Version=1.0
Name=${options.name}
Comment=Web App
Exec=${execCommand.join(" ")}
Terminal=false
X-MultipleArgs=false
Type=Application
Icon=${iconEntry}
Categories=GTK;WebApps;${options.category};
MimeType=text/html;text/xml;application/xhtml_xml;
StartupWMClass=${wmClass}
StartupNotify=true
X-WebApp-Browser=${options.browserCmd}
X-WebApp-URL=${options.url}
X-WebApp-CustomParameters=${options.customParams || ""}
X-WebApp-Navbar=false
X-WebApp-PrivateWindow=${options.private}
X-WebApp-Isolated=${options.isolated}
`.trim();

  fs.writeFileSync(desktopFilePath, entryContent, { mode: 0o755 });

}
