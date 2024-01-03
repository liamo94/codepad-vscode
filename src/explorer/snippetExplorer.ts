import * as vscode from "vscode";
import { join } from "path";
import { readFileSync, readdirSync } from "fs";
import { codepad } from "../types";
import { getSnippetDirectory, getOsPath } from "../fs";
import { massageString } from "../utils";

type Voidable<T> = T | undefined | void;

export class SnipperExplorer implements vscode.TreeDataProvider<SnippetItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<Voidable<SnippetItem>> =
    new vscode.EventEmitter<Voidable<SnippetItem>>();
  readonly onDidChangeTreeData: vscode.Event<Voidable<SnippetItem>> =
    this._onDidChangeTreeData.event;

  readonly userConfiguration = vscode.workspace.getConfiguration(codepad);
  readonly savePath = getOsPath(this.userConfiguration.savePath);
  readonly directoryName = this.userConfiguration.directoryName;
  directory = getSnippetDirectory();

  constructor(private workspaceRoot: string | undefined) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
    this.directory = getSnippetDirectory();
  }

  getTreeItem(element: SnippetItem): vscode.TreeItem {
    return element;
  }

  readTextFiles(directoryPath: string) {
    const files = readdirSync(directoryPath, { withFileTypes: true })
      .filter((f) => f.isFile() && f.name.endsWith(".md"))
      .map((dirent) => dirent.name);

    return files.reduce<Record<string, { language: string; snippet: string }>>(
      (acc, val) => {
        const filePath = join(directoryPath, val);
        const contents = readFileSync(filePath);
        const md = contents.toString();
        const language = md.split("- **Language**: ")[1]?.split("\n")[0] || "";
        const snippet =
          md
            .split("```")[1]
            ?.split("\n")
            ?.slice(1)
            ?.join("\n")
            ?.split("```")[0] || "No snippet found";
        acc[val] = { language, snippet };
        return acc;
      },
      {}
    );
  }

  getChildren(): Thenable<SnippetItem[]> {
    if (!this.workspaceRoot || (!this.directoryName && !this.savePath)) {
      return Promise.resolve([]);
    }
    const files = this.readTextFiles(this.directory);
    if (!Object.keys(files).length) return Promise.resolve([]);
    return Promise.resolve(
      Object.entries(files).map(
        ([title, { language, snippet }]) =>
          new SnippetItem(
            `${title.split(".md")[0]} | ${language}`,
            title,
            language,
            snippet,
            {
              command: "codepad.openSnippet",
              title,
              arguments: [title],
            }
          )
      )
    );
  }
}

export class SnippetItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly title: string,
    public readonly language: string,
    public readonly snippet: string,
    public readonly command?: vscode.Command
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);

    const markdown = new vscode.MarkdownString();
    markdown.appendCodeblock(massageString(snippet), this.language);
    this.tooltip = markdown;
  }

  contextValue = "snippet";
}
