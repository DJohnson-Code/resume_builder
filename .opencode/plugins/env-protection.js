export const EnvProtection = async () => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool !== "read") return

      const path = output.args.filePath

      const blocked =
        path.endsWith("/.env") ||
        path === ".env" ||
        /(^|\/)\.env\.(?!example$).+/.test(path)

      if (blocked) {
        throw new Error("Do not read .env files")
      }
    },
  }
}
