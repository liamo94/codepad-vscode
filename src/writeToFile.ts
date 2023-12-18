import { writeFileSync } from "fs";
import { Snippet } from "./types";

export const writeSnippetToFile = (snippet: Snippet, dir: string) => {
  writeFileSync(`${dir}/SNIP_${snippet.createdAt}`, JSON.stringify(snippet));
};

const getFileName = (fullFilePath: string, chosenName?: string) => {
  return fullFilePath.split("/").pop();
};
