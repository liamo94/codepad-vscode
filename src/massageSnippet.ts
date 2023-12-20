import { getFileExtension, getFileSize } from "./fs";
import { Snippet } from "./types";
import { massageString } from "./utils";

export const massageSnippet = (snippet: Snippet): Snippet => {
  const fullFilePath = snippet.fullFilePath;
  const fileSize = getFileSize(fullFilePath);

  return {
    ...snippet,
    snippet: massageString(snippet.snippet),
    fileExtension: getFileExtension(fullFilePath) || "none",
    fileSize,
  };
};
