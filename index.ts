process.on("SIGINT", () => {
  // Prevent default Bun/Node behavior
  // (inquirer will still throw its own error though)
});

import { CreateTabCut } from "./src/pkg/create";
import { listTabcutApps } from "./src/pkg/list";
import { removeTabcutApps } from "./src/pkg/remove";
import chalk from "chalk";

const args = process.argv.slice(2);
const command = args[0];

try {
  switch (command) {
    case "create":
      await CreateTabCut();
      break;

    case "list":
      await listTabcutApps();
      break;

    case "remove":
      await removeTabcutApps();
      break;

    case "help":
    case "--help":
    case "-h":
      console.log(
        chalk.green(`
  🐚 tabcut — Create WebApps as native launchers on Linux

  Usage:
    tabcut create     Create a new web app
    tabcut list       List installed tabcut apps
    tabcut remove     Remove one or more web apps
    tabcut help       Show this help menu
    tabcut --version  Print version
`)
      );
      break;

    case "--version":
    case "-v":
      console.log("tabcut v1.0.0");
      break;

    default:
      console.log("❌ Unknown command. Run `tabcut help`");
      break;
  }
} catch (err: unknown) {
  if (
    err instanceof Error &&
    err.name === "ExitPromptError"
  ) {
    console.log("\n👋 See you around!!.");
    process.exit(0);
  }

  console.error("❌ Unexpected error:", err);
  process.exit(1);
}
