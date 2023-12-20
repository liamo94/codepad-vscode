import * as vscode from "vscode";
import { format } from "prettier";
import { writeFileSync } from "fs";
import { Snippet } from "./types";

export const saveRawJSON = async (
  snippet: Snippet,
  directory: string,
  fileName: string
) => {
  const { saveRawJSON } = vscode.workspace.getConfiguration("codepad");
  if (!saveRawJSON) {
    return;
  }
  const formattedSnippet = await format(JSON.stringify(snippet), {
    parser: "json",
  });
  const filePath = `${directory}${fileName}.json`;
  writeFileSync(filePath, formattedSnippet);
  return filePath;
};
