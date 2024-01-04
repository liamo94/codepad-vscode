import * as vscode from "vscode";
import { format } from "prettier";
import { join } from "path";
import { writeFileSync } from "fs";
import { Snippet, codepad } from "./types";

export const saveRawJSON = (
  snippet: Snippet,
  directory: string,
  fileName: string
) => {
  const { saveRawJSON } = vscode.workspace.getConfiguration(codepad);
  if (!saveRawJSON) return;

  const formattedSnippet = format(JSON.stringify(snippet), {
    parser: "json",
  });
  const filePath = `${join(directory, fileName)}.json`;
  writeFileSync(filePath, formattedSnippet);
  return filePath;
};
