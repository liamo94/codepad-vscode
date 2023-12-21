// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { dirname } from "path";
import { unlinkSync } from "fs";
import { writeSnippetToFile } from "./writeToFile";
import { getDescription, getTitle } from "./details";
import { generateSnippet } from "./createSnippet";
import { codepad } from "./types";
import { SnipperExplorer } from "./explorer";
import { getSnippetDirectory } from "./fs";
import { Snippet } from "./explorer/snippetExplorer";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "codepad" is now active!');
  const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

  const snippetsExplorerProvider = new SnipperExplorer(rootPath);
  vscode.window.registerTreeDataProvider("snippets", snippetsExplorerProvider);
  vscode.commands.registerCommand("codepad.refreshEntry", () =>
    snippetsExplorerProvider.refresh()
  );
  vscode.commands.registerCommand("codepad.openSnippet", (selectedSnippet) => {
    const directory = getSnippetDirectory();
    const file = `${directory}/${selectedSnippet}`;
    const vsCodePath = vscode.Uri.parse(file);
    vscode.window.showTextDocument(vsCodePath);
  });
  vscode.commands.registerCommand("codepad.deleteEntry", (snippet: Snippet) => {
    unlinkSync(`${getSnippetDirectory()}/${snippet.title}`);
    snippetsExplorerProvider.refresh();
  });

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const addSnippet = vscode.commands.registerCommand("codepad.addSnippet", () =>
    runExtension(snippetsExplorerProvider)
  );

  const addSnippetWithTitle = vscode.commands.registerCommand(
    "codepad.addSnippetWithTitle",
    () => runExtension(snippetsExplorerProvider, true)
  );

  context.subscriptions.push(addSnippet);
  context.subscriptions.push(addSnippetWithTitle);

  vscode.workspace.onDidChangeConfiguration(
    (event: vscode.ConfigurationChangeEvent) => {
      if (
        event.affectsConfiguration("codepad.directoryName") ||
        event.affectsConfiguration("codepad.savePath")
      ) {
        vscode.commands.executeCommand("codepad.refreshEntry");
      }
    }
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

const runExtension = async (
  snippetsExplorerProvider: SnipperExplorer,
  askForDetails = false
) => {
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
        vscode.workspace.getConfiguration(codepad);

      const isHighlightLine =
        selection?.isEmpty &&
        selection?.isSingleLine &&
        selection?.start.character === selection?.end.character;

      if (selection && selection.isEmpty && !isHighlightLine) {
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

      if (title === undefined) return;

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
        snippetsExplorerProvider.refresh();
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
