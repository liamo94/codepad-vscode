import * as vscode from "vscode";
import { join } from "path";
import { readFileSync, readdirSync } from "fs";
import { codepad } from "../types";
import { getSnippetDirectory, getOsPath } from "../fs";
import { massageString, supportedLanguages } from "../utils";

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
    try {
      const files = readdirSync(directoryPath, { withFileTypes: true })
        .filter((f) => f.isFile() && f.name.endsWith(".md"))
        .map((dirent) => dirent.name);

      return files.reduce<
        Record<string, { language: string; snippet: string }>
      >((acc, file) => {
        const filePath = join(directoryPath, file);
        const contents = readFileSync(filePath);
        const md = contents.toString();
        const foundLanguage =
          md
            .split("File information")[1]
            ?.split("- **Language**: ")[1]
            ?.split("\n")[0] || "";
        const language = supportedLanguages.includes(foundLanguage)
          ? foundLanguage
          : "";
        const snippet =
          md
            .split("```")[1]
            ?.split("\n")
            ?.slice(1)
            ?.join("\n")
            ?.split("```")[0] || "No snippet found";
        acc[file] = { language, snippet };
        return acc;
      }, {});
    } catch {
      console.info("Snippet directory does not exist");
      return [];
    }
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
            `${title.split(".md")[0]} ${language ? `| ${language}` : ""}`,
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
    let formattedSnippet = massageString(snippet);

    //There is a weird issue in VS code were syntax highlighting doesn't work unless the codeblock
    //is surrounded by a `<?php ... ?>` tag.
    if (language === "php") {
      formattedSnippet = `<?php\n${formattedSnippet}\n?>`;
    }

    markdown.appendCodeblock(formattedSnippet, this.language);
    this.tooltip = markdown;
  }

  contextValue = "snippet";
}
