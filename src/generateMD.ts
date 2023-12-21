import { readFileSync } from "fs";
import { resolve } from "path";
import { getFileExtension, getFileLoc, getFileName, getFileSize } from "./fs";
import { Git, Snippet } from "./types";
import { getLanguageFromAlias } from "./utils";

export const generateMD = (snippet: Snippet, includeGit?: boolean) => {
  const templatePath = "./md/TEMPLATE.md";
  const fullTemplatePath = resolve(__dirname, templatePath);
  const data = readFileSync(fullTemplatePath);
  return replaceMdVariables(snippet, data.toString(), includeGit);
};

const replaceMdVariables = (
  {
    createdAt,
    fileName,
    fullFilePath,
    snippet,
    fileExtension,
    lines: [from, to],
    description,
    title,
    git,
  }: Snippet,
  md: string,
  includeGit?: boolean
) => {
  const fileSize = getFileSize(fullFilePath);
  const loc = getFileLoc(fullFilePath);
  const gitMd = includeGit && git ? generateGitMD(git) : "";

  const markdown = md
    .replace("{{title}}", title || fileName)
    .replace("{{description}}", description || "")
    .replace("{{createdAt}}", new Date(createdAt).toLocaleDateString())
    .replace("{{fileName}}", fileName)
    .replace("{{fullFilePath}}", fullFilePath)
    .replace("{{fileSize}}", fileSize.toString())
    .replace("{{loc}}", loc.toString())
    .replace("{{snippet}}", snippet)
    .replace("{{fileExtension}}", fileExtension || "none")
    .replace(
      "{{language}}",
      getLanguageFromAlias(
        getFileName(fullFilePath),
        getFileExtension(fullFilePath)
      )
    )
    .replace(
      "{{fileType}}",
      getLanguageFromAlias(
        getFileName(fullFilePath),
        getFileExtension(fullFilePath)
      ) ?? "Unknown"
    )
    .replace("{{lineRange}}", from !== to ? `${from}-${to}` : `L${from}`)
    .replace("{{lines}}", `${to - from}`);
  return `${markdown}\n${gitMd}`;
};

const generateGitMD = ({
  branch,
  fileCommitHash,
  fileCommitUrl,
  lineCommitHash,
  lineCommitUrl,
  repository,
  shareableLink,
  ssh,
  url,
}: Git) => {
  const templatePath = "./md/GIT_INFORMATION.md";
  const fullTemplatePath = resolve(__dirname, templatePath);
  const data = readFileSync(fullTemplatePath);
  return data
    .toString()
    .replace("{{git.repo}}", repository)
    .replace("{{git.url}}", url)
    .replace("{{git.ssh}}", ssh)
    .replace("{{git.shareableLink}}", shareableLink)
    .replace("{{git.branch}}", branch)
    .replace("{{git.fileHash}}", fileCommitHash)
    .replace("{{git.fileHashUrl}}", fileCommitUrl)
    .replace("{{git.snippetCommitHash}}", lineCommitHash)
    .replace("{{git.snippetCommitHashUrl}}", lineCommitUrl);
};