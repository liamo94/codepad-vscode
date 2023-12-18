import { statSync, readFileSync } from "fs";
import { extname } from "path";

export const getFileSize = (path: string) => {
  return statSync(path).size;
};

export const getFileLoc = (path: string) => {
  return readFileSync(path).toString().split("\n").length;
};

export const getFileExtension = (path: string) => {
  return extname(path);
};
