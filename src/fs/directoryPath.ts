import * as vscode from "vscode";
import { codepad } from "../types";

export const getSnippetDirectory = () => {
  const userConfiguration = vscode.workspace.getConfiguration(codepad);
  const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  const savePath = userConfiguration.savePath;
  const directoryName = userConfiguration.directoryName;
  return `${savePath || rootPath}/${directoryName}`;
};
