import { execSync } from "child_process";
import { Git, LineRange } from "./types";

const isGit = (fullFilePath: string) =>
  execSync(`(cd ${fullFilePath} && git rev-parse --is-inside-work-tree)`)
    .toString()
    .trim() === "true";

const createUrl = (url: string, commitHash: string) =>
  `https://www.${url}/commit/${commitHash}`;

const runGitCommand = (fullFilePath: string, command: string) => {
  // Wrap in a try/catch as if the file is untracked then there could be issues with git
  try {
    return execSync(`(cd ${fullFilePath} && ${command})`).toString().trim();
  } catch (e) {
    console.error("Error running git command", e);
    return "";
  }
};

const getShareableLink = (
  url: string,
  commitHash: string,
  repoPath: string,
  fullFilePath: string,
  [fromLine, toLine]: LineRange
) => {
  const relativePath = fullFilePath.replace(repoPath, "");
  const lines =
    fromLine === toLine ? `L${fromLine}` : `L${fromLine}-L${toLine}`;
  return `https://www.${url}/blob/${commitHash}${relativePath}#${lines}`;
};

export const getGitInformation = (
  fullFilePath: string,
  rootToFile: string,
  selectedLines: LineRange
): Git | undefined => {
  if (!isGit(fullFilePath)) {
    console.info("No .git detected in repository");
    return undefined;
  }

  const fileCommitHash = runGitCommand(
    fullFilePath,
    `git log -n 1 --pretty=format:%H -- ${rootToFile}`
  );

  const lineCommitHash =
    runGitCommand(
      fullFilePath,
      `git log -L ${selectedLines[0]},${selectedLines[0]}:${rootToFile} | awk '/^commit/ {print $2}'`
    ).split("\n")[0] || "";

  const repository = runGitCommand(
    fullFilePath,
    "git config --get remote.origin.url | awk -F/ '{print $NF}' | sed 's/.git$//'"
  );

  const ssh = runGitCommand(fullFilePath, "git config --get remote.origin.url");

  const url = runGitCommand(
    fullFilePath,
    "git config --get remote.origin.url | sed 's|git@\\(.*\\):|\\1/|;s/.git$//'"
  );

  const branch = runGitCommand(fullFilePath, "git branch --show-current");

  const currentCommitHash = runGitCommand(fullFilePath, "git rev-parse HEAD");

  return {
    fileCommitHash,
    repository,
    lineCommitHash,
    ssh,
    branch,
    url: `https://www.${url}`,
    fileCommitUrl: fileCommitHash ? createUrl(url, fileCommitHash) : "",
    lineCommitUrl: lineCommitHash ? createUrl(url, lineCommitHash) : "",
    shareableLink: getShareableLink(
      url,
      currentCommitHash,
      fullFilePath,
      rootToFile,
      selectedLines
    ),
  };
};
