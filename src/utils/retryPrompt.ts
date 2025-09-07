import chalk from "chalk";
export const retryPrompt = async <T>(
  promptFn: () => Promise<T>,
  validate: (value: T) => boolean | string
): Promise<T> => {
  while (true) {
    const result = await promptFn();
    const validation = validate(result);
    if (validation === true) return result;
    console.log(
      chalk.red(
        typeof validation === "string"
          ? validation
          : "❌ Invalid input. Try again."
      )
    );
  }
};
