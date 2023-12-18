// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { Git, Snippet } from "./types";
import { homedir } from "os";
import { getGitInformation } from "./getGitInformation";
import { generateMD } from "./generateMD";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "codepad" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "codepad.addSnippet",
    async () => {
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Window,
          cancellable: false,
          title: "Creating snippet",
        },
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        async (progress) => {
          progress.report({ increment: 0 });

          let git: Git | undefined;

          const editor = vscode.window.activeTextEditor;
          const documentText = editor?.document.getText();
          const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
          const fullFilePath = editor?.document.fileName;
          const createdAt = new Date().toISOString();
          const selection = editor?.selection;
          const { savePath, includeGitDetails, openInIDE, saveRawJSON } =
            vscode.workspace.getConfiguration("codepad");
          let snippet = "";
          if (selection && !selection.isEmpty) {
            const selectionRange = new vscode.Range(
              selection.start.line,
              selection.start.character,
              selection.end.line,
              selection.end.character
            );
            snippet = editor.document.getText(selectionRange);
          }
          if (!snippet) {
            return vscode.window.showInformationMessage(
              "No code snippet selected"
            );
          }
          const title = await getSearchQuery();
          if (title === undefined) {
            return;
          }

          try {
            console.log(rootPath);
            progress.report({ increment: 100 });
            if (selection && !selection.isEmpty && rootPath) {
              git = await getGitInformation(rootPath, fullFilePath || "", [
                selection.start.line + 1,
                selection.end.line + 1,
              ]);
              console.log(JSON.stringify(git));
              generateMD({
                snippet,
                createdAt,
                fileName: "TODO",
                fullFilePath: fullFilePath || "",
                title,
                git,
                lines: [selection.start.line + 1, selection.end.line + 1],
              });
            }
            vscode.window.showInformationMessage("hey", JSON.stringify(git));
          } catch (e) {
            console.log(e);
            progress.report({ increment: 100 });
            const text = execSync("pwd").toString().trim();
            console.log(text);
            vscode.window.showErrorMessage("There was an error", text);
          } finally {
            progress.report({ increment: 100 });
          }
        }
      );
    }
  );

  let disposable2 = vscode.commands.registerCommand(
    "codepad.addSnippetWithTitle",
    async () => {
      vscode.window.showInformationMessage("nice one");
    }
  );

  let disposable3 = vscode.commands.registerCommand(
    "codepad.addSnippetWithFilePath",
    async () => {
      vscode.window.showInformationMessage("nice one");
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(disposable2);
  context.subscriptions.push(disposable3);
}

function createFolderIfNotExists(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
}

function writeSnippetToFile(snippet: Snippet, dir: string) {
  writeFileSync(`${dir}/SNIP_${snippet.createdAt}`, JSON.stringify(snippet));
}

// This method is called when your extension is deactivated
export function deactivate() {}

const getSearchQuery = async () =>
  await vscode.window.showInputBox({
    placeHolder: "Title",
    prompt: "Set title for snippet",
  });
