import * as vscode from "vscode";

export const getTitle = async () =>
  await vscode.window.showInputBox({
    placeHolder: "Title",
    prompt: "Set title for snippet",
  });

export const getDescription = async () =>
  await vscode.window.showInputBox({
    placeHolder: "Description (optional)",
    prompt: "Add a description for the snippet",
  });
