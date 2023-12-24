import * as vscode from "vscode";
import { join } from "path";
import { codepad } from "../types";
import { getOsPath } from "./osPath";

export const getSnippetDirectory = () => {
  const userConfiguration = vscode.workspace.getConfiguration(codepad);
  const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  const savePath = getOsPath(userConfiguration.savePath);
  const directoryName = userConfiguration.directoryName;
  return join(savePath || rootPath || "", directoryName);
};
