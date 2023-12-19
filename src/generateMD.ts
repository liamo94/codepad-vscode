import { Snippet } from "./types";
import { readFileSync } from "fs";
import { resolve } from "path";
import { getFileExtension, getFileLoc, getFileSize } from "./fileInformation";
export const generateMD = (snippet: Snippet, includeGit?: boolean) => {
  //Use fetch to import TEMPLATE.md from local path
  //Replace variables in TEMPLATE.md with snippet data
  //Return string
  const templatePath = "./md/TEMPLATE.md";
  const gitTemplatePath = "/md/GIT_TEMPLATE.md";
  let templateContent = "";
  const fullTemplatePath = resolve(__dirname, templatePath);
  console.log(fullTemplatePath);
  const data = readFileSync(fullTemplatePath);
  console.log(replaceMdVariables(snippet, data.toString()));
  return replaceMdVariables(snippet, data.toString());
};

const replaceMdVariables = (
  {
    createdAt,
    fileName,
    fullFilePath,
    snippet,
    fileExtension,
    fileType,
    lines: [from, to],
    description,
    title,
  }: Snippet,
  md: string
) => {
  const fileSize = getFileSize(fullFilePath);
  const loc = getFileLoc(fullFilePath);
  return md
    .replace("{{title}}", title || fileName)
    .replace("{{description}}", description || "")
    .replace("{{createdAt}}", createdAt)
    .replace("{{fileName}}", fileName)
    .replace("{{fullFilePath}}", fullFilePath)
    .replace("{{fileSize}}", fileSize.toString())
    .replace("{{loc}}", loc.toString())
    .replace("{{snippet}}", snippet)
    .replace("{{fileExtension}}", getFileExtension(fullFilePath) || "none")
    .replace("{{language}}", fileType || "")
    .replace("{{fileType}}", fileType || "Unknown")
    .replace("{{lineRange}}", from !== to ? `${from}-${to}` : `L${from}`)
    .replace("{{lines}}", `${to - from}`);
};
// read raw md file
// replace variables with data
// if git, read raw git file, replace variables with data and append to md file
// check for directory
// write to file
// finish
