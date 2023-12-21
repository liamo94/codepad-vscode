import * as vscode from "vscode";
import * as path from "path";
import { readFileSync, readdirSync } from "fs";
import { codepad } from "../types";
import { getSnippetDirectory } from "../fs";

type Voidable<T> = T | undefined | void;

export class SnipperExplorer implements vscode.TreeDataProvider<Snippet> {
  private _onDidChangeTreeData: vscode.EventEmitter<Voidable<Snippet>> =
    new vscode.EventEmitter<Voidable<Snippet>>();
  readonly onDidChangeTreeData: vscode.Event<Voidable<Snippet>> =
    this._onDidChangeTreeData.event;

  readonly userConfiguration = vscode.workspace.getConfiguration(codepad);
  readonly savePath = this.userConfiguration.savePath;
  readonly directoryName = this.userConfiguration.directoryName;
  readonly directory = getSnippetDirectory();

  constructor(private workspaceRoot: string | undefined) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Snippet): vscode.TreeItem {
    return element;
  }

  readTextFiles(directoryPath: string) {
    // Read the list of files in the specified directory
    //   const fileContentsMap: Record<string, string> = {};
    const files = readdirSync(directoryPath);

    return files.reduce<Record<string, string>>((acc, val) => {
      // TODO we could show data inside the snippet
      const filePath = path.join(directoryPath, val);
      const contents = readFileSync(filePath);
      const md = contents.toString();
      const language = md.split("- **Language**: ")[1].split("\n")[0] || "";
      acc[val] = language;
      return acc;
    }, {});
  }

  getChildren(): Thenable<Snippet[]> {
    if (!this.workspaceRoot || (!this.directoryName && !this.savePath)) {
      return Promise.resolve([]);
    }
    const files = this.readTextFiles(this.directory);
    if (!Object.keys(files).length) return Promise.resolve([]);
    return Promise.resolve(
      Object.entries(files).map(
        ([title, language]) =>
          new Snippet(`${title} | ${language}`, language, {
            command: "codepad.openSnippet",
            title,
            arguments: [title],
          })
      )
    );
  }
}

export class Snippet extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly language: string,
    public readonly command?: vscode.Command
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);

    // TODO maybe show description as tooltip...
    // this.tooltip = `${this.label} | ${this.language}`;
  }

  contextValue = "snippets";
}