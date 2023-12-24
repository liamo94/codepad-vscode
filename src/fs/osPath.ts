import { platform } from "os";

/**
 * The default path is `.vscode/codepad`, so this ensures if works
 * correctly on windows
 */
export const getOsPath = (anyPath?: string) => {
  if (!anyPath) return "";
  if (platform() !== "win32") return anyPath;
  return anyPath.replace(/\//g, "\\");
};
