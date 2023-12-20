// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { dirname } from "path";
import { writeSnippetToFile } from "./writeToFile";
import { getDescription, getTitle } from "./details";
import { generateSnippet } from "./createSnippet";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "codepad" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const addSnippet = vscode.commands.registerCommand(
    "codepad.addSnippet",
    runExtension
  );

  const addSnippetWithTitle = vscode.commands.registerCommand(
    "codepad.addSnippetWithTitle",
    () => runExtension(true)
  );

  context.subscriptions.push(addSnippet);
  context.subscriptions.push(addSnippetWithTitle);
}

// This method is called when your extension is deactivated
export function deactivate() {}

const runExtension = async (askForDetails = false) => {
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

      const editor = vscode.window.activeTextEditor;
      const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
      const fullFilePathWithFile = editor?.document.fileName;
      const fullFilePath = dirname(fullFilePathWithFile || "");

      const selection = editor?.selection;
      const { savePath, directoryName, openInIDE } =
        vscode.workspace.getConfiguration("codepad");

      if (selection && !selection.isEmpty) {
        const selectionRange = new vscode.Range(
          selection.start.line,
          selection.start.character,
          selection.end.line,
          selection.end.character
        );
        if (!editor.document.getText(selectionRange)) {
          return vscode.window.showInformationMessage(
            "No code snippet selected"
          );
        }
      }

      const title = askForDetails ? await getTitle() : "";
      const description = askForDetails ? await getDescription() : "";

      if (title === undefined) {
        return;
      }

      try {
        progress.report({ increment: 100 });

        const snippet = await generateSnippet(title, description);
        const path = await writeSnippetToFile({
          snippet,
          directoryPath: savePath,
          filePath: fullFilePath || "",
          directoryName,
          rootPath,
        });
        if (openInIDE) {
          const vsCodePath = vscode.Uri.parse(path);
          vscode.window.showTextDocument(vsCodePath);
        }
      } catch (e) {
        progress.report({ increment: 100 });
        vscode.window.showErrorMessage(
          "There was an error generating code snippet"
        );
      } finally {
        progress.report({ increment: 100 });
      }
    }
  );
};
