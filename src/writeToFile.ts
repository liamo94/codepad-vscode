import * as vscode from "vscode";
import { accessSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { format } from "prettier";
import { Snippet, codepad } from "./types";
import { generateMD } from "./md";
import { saveRawJSON } from "./saveJson";

export const writeSnippetToFile = async ({
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
  const stringSnippet = await format(generateMD(snippet), {
    parser: "markdown",
  });
  let fileName = snippet.title
    ? snippet.title.replace(/ /g, "_")
    : snippet.fileExtension
    ? snippet.fileName.split(snippet.fileExtension)[0]
    : snippet.fileName;

  let jsonFileName = fileName;

  const directory = join(dir || "", directoryName || "");

  //TODO could add protection against slim chance of name collisions
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
  await saveRawJSON(snippet, directory, jsonFileName);

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

  return file;
};

// Create a 3 character uuid. Keep small for simplicity as should be unique enough
const generateUID = () => {
  let firstPart: string | number = (Math.random() * 46656) | 0;
  let secondPart: string | number = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-1);
  secondPart = ("000" + secondPart.toString(36)).slice(-2);
  return (firstPart + secondPart).toLowerCase();
};

// i don't want to override files
const fileExists = (directory: string, fileName: string, extension = "md") => {
  try {
    accessSync(`${join(directory, fileName)}.${extension}`);
    return true;
  } catch {
    return false;
  }
};
