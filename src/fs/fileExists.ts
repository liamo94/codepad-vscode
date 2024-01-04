import { accessSync } from "fs";
import { join } from "path";

export const fileExists = (
  directory: string,
  fileName: string,
  extension = "md"
) => {
  try {
    accessSync(`${join(directory, fileName)}.${extension}`);
    return true;
  } catch {
    return false;
  }
};
