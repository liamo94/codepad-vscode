import * as vscode from "vscode";
import { dirname, join } from "path";
import { unlinkSync } from "fs";
import { writeSnippetToFile } from "./writeToFile";
import { getDescription, getTitle } from "./prompts";
import { generateSnippet } from "./createSnippet";
import { codepad } from "./types";
import { SnipperExplorer, SnippetItem } from "./explorer";
import { getSnippetDirectory, getOsPath } from "./fs";

export function activate(context: vscode.ExtensionContext) {
  console.info("Codepad is running...");
  const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

  const snippetsExplorerProvider = new SnipperExplorer(rootPath);
  vscode.window.registerTreeDataProvider("snippets", snippetsExplorerProvider);
  vscode.commands.registerCommand("codepad.refreshEntry", () =>
    snippetsExplorerProvider.refresh()
  );
  vscode.commands.registerCommand("codepad.openSnippet", (selectedSnippet) => {
    const directory = getSnippetDirectory();
    const file = join(directory, selectedSnippet);
    const vsCodePath = vscode.Uri.parse(file);
    vscode.window.showTextDocument(vsCodePath);
  });
  vscode.commands.registerCommand(
    "codepad.deleteEntry",
    (snippet: SnippetItem) => {
      unlinkSync(join(getSnippetDirectory(), snippet.title));
      snippetsExplorerProvider.refresh();
    }
  );

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

      if (title === undefined) {
        console.info("No title provided, aborting");
        return;
      }
      const description = askForDetails ? await getDescription() : "";

      try {
        const snippet = await generateSnippet(title, description);
        const path = await writeSnippetToFile({
          snippet,
          directoryPath: getOsPath(savePath),
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
        vscode.window.showErrorMessage(
          "There was an error generating snippet."
        );
        console.error(`Error: ${(e as Error).message}`);
      } finally {
        progress.report({ increment: 100 });
      }
    }
  );
};
