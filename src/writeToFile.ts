import * as vscode from "vscode";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { format } from "prettier";

import { Snippet, codepad } from "./types";
import { generateMD } from "./md";
import { saveRawJSON } from "./saveJson";
import { generateUID } from "./utils";
import { fileExists } from "./fs";

export const writeSnippetToFile = ({
  directoryPath,
  filePath,
  snippet,
  directoryName,
  rootPath,
}: {
  snippet: Snippet;
  directoryPath?: string;
  filePath: string;
  directoryName?: string;
  rootPath?: string;
}) => {
  // if directory name is set, save to this dir.
  // else, if they have no `directoryName` set this indicates save next to file
  const dir = directoryPath || (directoryName ? rootPath : filePath);

  const stringSnippet = format(generateMD(snippet), {
    parser: "markdown",
  });
  let fileName = snippet.title
    ? snippet.title.replace(/ /g, "_")
    : snippet.fileExtension
    ? snippet.fileName.split(snippet.fileExtension)[0]
    : snippet.fileName;

  let jsonFileName = fileName;

  const directory = join(dir || "", directoryName || "");

  // Check file exists first so I don't override files
  // TODO could add protection against slim chance of name collisions
  if (fileExists(directory, fileName)) {
    fileName += `_${generateUID()}`;
  }
  if (directory && !existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  const file = `${join(directory, fileName)}.md`;

  writeFileSync(file, stringSnippet);

  if (fileExists(directory, fileName, "json")) {
    jsonFileName += `_${generateUID()}`;
  }
  saveRawJSON(snippet, directory, jsonFileName);

  showSuccessMessage(fileName, file);

  return file;
};

const showSuccessMessage = (fileName: string, file: string) => {
  const { openInIDE } = vscode.workspace.getConfiguration(codepad);

  const vsCodePath = vscode.Uri.parse(file);

  const successMessage = `Snippet ${fileName} successfully created`;
  openInIDE
    ? vscode.window.showInformationMessage(successMessage)
    : vscode.window
        .showInformationMessage(successMessage, "Open snippet")
        .then((selection) => {
          if (selection === "Open snippet") {
            vscode.window.showTextDocument(vsCodePath);
          }
        });
};
