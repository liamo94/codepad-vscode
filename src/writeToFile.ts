import * as vscode from "vscode";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { format } from "prettier";
import { Snippet } from "./types";
import { generateMD } from "./generateMD";
import { saveRawJSON } from "./saveRawJSON";

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
  const { includeGitDetails } = vscode.workspace.getConfiguration("codepad");
  // if directory name is set, save to this dir.
  // Else, if they have no directoryName set this indicates save next to file
  const dir = directoryPath || (directoryName ? rootPath : filePath);
  const stringSnippet = await format(generateMD(snippet, includeGitDetails), {
    parser: "markdown",
  });
  const fileName = snippet.title
    ? `${snippet.title.replace(/ /g, "_")}_${generateUID()}`
    : snippet.createdAt;

  const directory = `${dir}/${directoryName ? `${directoryName}/` : ""}`;
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }
  const file = `${directory}${fileName}.md`;

  writeFileSync(file, stringSnippet);
  await saveRawJSON(snippet, directory, fileName);

  vscode.window.showInformationMessage(
    `Snippet ${fileName} successfully created`
  );

  return file;
};

const generateUID = () => {
  let firstPart: string | number = (Math.random() * 46656) | 0;
  let secondPart: string | number = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return (firstPart + secondPart).toUpperCase();
};
