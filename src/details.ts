import * as vscode from "vscode";

export const getTitle = async () =>
  await vscode.window.showInputBox({
    placeHolder: "Title",
    prompt:
      "The title you want for your snippet (will be used for the file name)",
  });

export const getDescription = async () =>
  await vscode.window.showInputBox({
    placeHolder: "Description (optional)",
    prompt: "Add a description for the snippet",
  });
