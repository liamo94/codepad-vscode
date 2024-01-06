# Codepad

**Seamlessly create detailed snippets from within VS code**

<img width="1509" alt="codepad-screenshot" src="https://github.com/liamo94/codepad-vscode/assets/9355016/bed74a47-1842-4b4c-9640-64c87abdacac">

Add snippets with one keyboard shortcut - it has never been easier to take notes from within a codebase.

Choose to store the snippets next to your file, inside your open directory or any location of your choice.

Choose to save the raw `JSON` output so you can feed your snippets to other apps.

If available, save `git` details within your snippet.

Easily add title, description and other useful notes all within your IDE.

View all snippets in one place.

All snippets are generated in a formatted `markdown` for easy universal viewing and editing. Optionally hook it up into a dedicated md note-taking app.

> **TIP**: Make sure the location you store snippets is inside `.gitignore` or outside the working directory if using a shared repository.

In order to exclude snippets from your search, you can add an exclude rule in your settings:

```json
"search.exclude": {
  "**/.vscode/snippets": true
}
```

Ensure to change the path to your `codepad.savePath`.

### Available settings:

- `codepad.savePath`: Path to save code snippet. Leave blank to save by your current IDE directory.

- `codepad.directoryName`: Folder to save code snippets in. Leave blank to save by file (only if no save path is set). Defaults to `.vscode/snippets`. Make sure the directory is inside your `.gitignore` if using on a shared repository.

- `codepad.includeGitDetails`: Choose whether to include git details (if available). Defaults to `true`.

- `codepad.openInIDE`: Choose whether to open your new note immediately in a new tab. Defaults to `true`.

- `codepad.saveRawJSON`: Save the raw JSON of the data used to generate your snippet. Defaults to `false`.

### Snippet explorer

- You can easily view all snippets in one place in the snippet explorer. From here you can click a snippet to open it, or by right clicking either deleting the snippet or copying it to the clipboard. Hovering over a snipept shows a preview.

![snippets](https://github.com/liamo94/codepad-vscode/assets/9355016/fd631290-204f-4ed3-8e37-f1aae9957802)

- To find a snippet, press `cmd + f`/`ctl + f`, and use the arrow keys to jump between findings before hitting enter to open the selected snippet.

![find](https://github.com/liamo94/codepad-vscode/assets/9355016/7b2bb18f-33a8-423b-8278-53a8cae1ce4e)

### Source Code

The source code is available on GitHub [here](https://github.com/liamo94/codepad-vscode).

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=liamoco.codepad).

Alternatively, open Visual Studio code, press `cmd + shift + P` on Mac or `ctl + shift + P` on Windows and type:

> ext install liamoco.codepad

## Controls

### Save snippet

To save a quick snippet, press:

> Mac `cmd + shift + '`

> Windows `ctl + shift + '`

You can change this in `Key Bindings` (search `codepad`), as well as setting a separate command for creating a snippet with a title and optional description. Alternatively you can run it manually from the command window by pressing (`cmd + shift + p`/`ctl + shift + p`) and searching `codepad`, or right clicking on your open editor and looking for the codepad options.

### Viewing snippets within the menu

You can click a snippet in the `CODEPAD: SNIPPETS` menu to open it inside your IDE.

You can also delete the snippet from within the menu by right clicking it.

## Demo

https://github.com/liamo94/codepad-vscode/assets/9355016/69640f97-d75b-444f-b6c7-168f3e3f20bb


