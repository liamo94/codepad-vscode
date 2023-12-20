import { statSync, readFileSync } from "fs";
import { extname, basename } from "path";

export const getFileSize = (path: string) => statSync(path).size;

export const getFileLoc = (path: string) => {
  return readFileSync(path).toString().split("\n").length;
};

export const getFileExtension = (path: string) => extname(path);

export const getFileName = (path: string) => basename(path);
