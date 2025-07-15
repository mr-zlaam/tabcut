import { getTabcutApps } from "../utils/getTabcutApps";
import chalk from "chalk";

export async function listTabcutApps() {
  const apps = getTabcutApps();

  if (!apps.length) {
    console.log(chalk.yellow("⚠️  No web apps created by tabcut found."));
    return;
  }

  console.log(chalk.bold.cyan("\n🧾 Tabcut WebApps Installed:\n"));

  apps.forEach((app, index) => {
    console.log(
      `${chalk.green(`#${index + 1}`)} ${chalk.bold(app.name)} — ${chalk.magenta(app.url)}`
    );
    console.log(
      `   🧭 Browser: ${chalk.blue(app.browser)} | 🔐 Private: ${app.privateWindow ? "Yes" : "No"} | 🧍 Isolated: ${app.isolated ? "Yes" : "No"}`
    );
    console.log(`   🖼️  Icon: ${chalk.gray(app.icon)}`);
    console.log(`   📄 File: ${chalk.gray(app.filePath)}\n`);
  });
}
