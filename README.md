# Codepad

**Seamlessly create detailed snippets from within VS code**

<img width="1506" alt="Screenshot 2023-12-22 at 00 00 29" src="https://github.com/liamo94/codepad-vscode/assets/9355016/8c1d6c74-69cf-42c5-920e-a79fc9d2632a">

Add snippets with one keyboard shortcut - it has never been easier to take notes from within a codebase.

Choose to store the snippets next to your file, inside your open directory or any location of your choice.

Choose to save the raw `JSON` output so you can feed your snippets to other apps.

If available, save `git` details within your snippet.

Easily add title, description and other useful notes all within your IDE.

View all snippets in one place.

All snippets are generated in a formatted `markdown` for easy universal viewing and editing. Optionally hook it up into a dedicated md note-taking app.

> **TIP**: Make sure the location you store snippets is inside `.gitignore` or outside the working directory if using a shared repository.

In other to exclude snippets from your search, you can add an exclude rule:

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

https://github.com/liamo94/codepad-vscode/assets/9355016/c897c725-2c1a-4d1d-a94d-6e2e7e2e12fa
