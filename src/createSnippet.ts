import { Snippet } from "./types";
import * as vscode from "vscode";
import { getGitInformation } from "./getGitInformation";
import { massageSnippet } from "./massageSnippet";

export const generateSnippet = async (
  title?: string,
  description?: string
): Promise<Snippet> => {
  const editor = vscode.window.activeTextEditor;
  const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  const fullFilePathWithFile = editor?.document.fileName;
  //   const fullFilePath = dirname(fullFilePathWithFile || "");
  const selection = editor!.selection;
  const createdAt = new Date().toISOString();

  const selectionRange = new vscode.Range(
    selection.start.line,
    selection.start.character,
    selection.end.line,
    selection.end.character
  );
  const snippet = editor!.document.getText(selectionRange);
  const git = await getGitInformation(rootPath!, fullFilePathWithFile || "", [
    selection.start.line + 1,
    selection.end.line + 1,
  ]);
  const snippetObj: Snippet = {
    snippet,
    createdAt,
    fileName: fullFilePathWithFile?.split("/").pop() || "",
    fullFilePath: fullFilePathWithFile || "",
    title,
    description,
    git,
    lines: [selection!.start.line + 1, selection!.end.line + 1],
  };
  return massageSnippet(snippetObj);
};