import { execSync } from "child_process";
import { Git } from "./types";

const isGit = (fullFilePath: string) =>
  execSync(`(cd ${fullFilePath} && git rev-parse --is-inside-work-tree)`)
    .toString()
    .trim() === "true";

const createUrl = (url: string, commitHash: string) =>
  `${url}/commit/${commitHash}`;

const runGitCommand = (fullFilePath: string, command: string) =>
  execSync(`(cd ${fullFilePath} && ${command})`).toString().trim();

const getShareableLink = (
  url: string,
  commitHash: string,
  repoPath: string,
  fullFilePath: string,
  [fromLine, toLine]: [from: number, to: number]
) => {
  const relativePath = fullFilePath.replace(repoPath, "");
  const lines =
    fromLine === toLine ? `L${fromLine}` : `L${fromLine}-L${toLine}`;
  return `${url}/blob/${commitHash}${relativePath}#${lines}`;
};

export const getGitInformation = async (
  fullFilePath: string,
  rootToFile: string,
  selectedLines: [from: number, to: number]
): Promise<Git | undefined> => {
  if (!isGit(fullFilePath)) {
    return undefined;
  }

  const fileCommitHash = runGitCommand(
    fullFilePath,
    `git log -n 1 --pretty=format:%H -- ${rootToFile}`
  );

  //this may not be working correctly
  const lineCommitHash = runGitCommand(
    fullFilePath,
    `git log -L ${selectedLines[0]},${selectedLines[0]}:${rootToFile} | awk '/^commit/ {print $2}'`
  );

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
    url,
    branch,
    fileCommitUrl: createUrl(url, fileCommitHash),
    lineCommitUrl: createUrl(url, lineCommitHash),
    shareableLink: getShareableLink(
      url,
      currentCommitHash,
      fullFilePath,
      rootToFile,
      selectedLines
    ),
  };
};
