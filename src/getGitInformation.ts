import { execSync } from "child_process";
import { Git } from "./types";

const isGit = (fullFilePath: string) =>
  execSync(`(cd ${fullFilePath} && git rev-parse --is-inside-work-tree)`)
    .toString()
    .trim() === "true";

const createUrl = (url: string, commitHash: string) =>
  `${url}/commit/${commitHash}`;

export const getGitInformation = async (
  fullFilePath: string,
  rootToFile: string,
  selectedLines: [from: number, to: number] | undefined
): Promise<Git | undefined> => {
  if (!isGit(fullFilePath)) {
    return undefined;
  }

  const fileCommitHash = await execSync(
    `(cd ${fullFilePath} && git rev-parse HEAD)`
  )
    .toString()
    .trim();

  const lineCommitHash = !!selectedLines?.length
    ? execSync(
        `(cd ${fullFilePath} && git log -L ${selectedLines[0]},${selectedLines[0]}:${rootToFile} | awk '/^commit/ {print $2}')`
      )
        .toString()
        .trim()
    : undefined;

  const repository = await execSync(
    `(cd ${fullFilePath} && git config --get remote.origin.url | awk -F/ '{print $NF}' | sed 's/.git$//')`
  )
    .toString()
    .trim();

  const ssh = execSync(
    `(cd ${fullFilePath} && git config --get remote.origin.url)`
  )
    .toString()
    .trim();

  console.log(
    `(cd ${fullFilePath} && git config --get remote.origin.url | sed 's|git@\(.*\):|\\1/|;s/.git$//')`
  );
  const url = execSync(
    `(cd ${fullFilePath} && git config --get remote.origin.url | sed 's|git@\\(.*\\):|\\1/|;s/.git$//')`
  )
    .toString()
    .trim();

  const branch = execSync(`(cd ${fullFilePath} && git branch --show-current)`)
    .toString()
    .trim();

  return {
    fileCommitHash,
    repository,
    lineCommitHash,
    ssh,
    url,
    branch,
    fileCommitUrl: createUrl(url, fileCommitHash),
    lineCommitUrl: lineCommitHash && createUrl(url, lineCommitHash),
  };
};
