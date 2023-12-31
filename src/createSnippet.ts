import * as vscode from "vscode";
import { basename } from "path";
import { Snippet } from "./types";
import { getGitInformation } from "./getGitInformation";
import { massageSnippet } from "./utils";

export const generateSnippet = (
  title?: string,
  description?: string
): Snippet => {
  const editor = vscode.window.activeTextEditor;
  const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  const fullFilePathWithFile = editor?.document.fileName;
  const relativePath = vscode.workspace.asRelativePath(
    fullFilePathWithFile || ""
  );
  const selection = editor!.selection;
  const createdAt = new Date().toISOString();

  const isHighlightLine =
    selection?.isEmpty &&
    selection?.isSingleLine &&
    selection?.start.character === selection?.end.character;

  const selectionRange = isHighlightLine
    ? new vscode.Range(
        selection.start.line,
        0,
        selection.end.line,
        editor?.document.lineAt(selection?.active?.line || 0).range.end
          .character || 0
      )
    : new vscode.Range(
        selection.start.line,
        selection.start.character,
        selection.end.line,
        selection.end.character
      );

  const snippet = editor!.document.getText(selectionRange);
  const git = getGitInformation(rootPath!, fullFilePathWithFile || "", [
    selection.start.line + 1,
    selection.end.line + 1,
  ]);

  const codeSnippet: Snippet = {
    snippet,
    createdAt,
    fileName: basename(fullFilePathWithFile || ""),
    fullFilePath: fullFilePathWithFile || "",
    title,
    description,
    git,
    relativePath,
    lines: [selection!.start.line + 1, selection!.end.line + 1],
  };
  return massageSnippet(codeSnippet);
};
