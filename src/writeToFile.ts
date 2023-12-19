import { existsSync, mkdirSync, writeFile, writeFileSync, promises } from "fs";
import { Snippet } from "./types";
import { generateMD } from "./generateMD";
import { execSync } from "child_process";
import path from "path";
import { format } from "prettier";

export const writeSnippetToFile = async ({
  directoryPath,
  filePath,
  snippet,
  directoryName,
  rootPath,
  isGit,
}: {
  snippet: Snippet;
  directoryPath?: string;
  filePath: string;
  directoryName?: string;
  rootPath?: string;
  isGit?: boolean;
}) => {
  // if directory name is set, save to this dir. Else, if they have no directoryName set this indicates save next to file
  const dir = directoryPath || (directoryName ? rootPath : filePath);
  const stringSnippet = await format(generateMD(snippet, isGit), {
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
  //TODO see if we want to open the file

  writeFileSync(file, stringSnippet);

  return file;
};

const generateUID = () => {
  let firstPart: string | number = (Math.random() * 46656) | 0;
  let secondPart: string | number = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return (firstPart + secondPart).toUpperCase();
};
