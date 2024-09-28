# VSC Extension Helper

![GitHub Release Date](https://img.shields.io/github/release-date/czfadmin/vsc-extension-helper?logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/czfadmin/vsc-extension-helper?logo=github)

Use decorators or higher-order functions to help you register commands.

## Usage

- Install the dependencies:

```bash
# yarn
yarn add vsc-extension-helper

# npm
npm install vsc-extension-helper

```

- If you use decorator syntax, modify `tsconfig.json` to enable the decorator experimental option, and modify the entry file to import `reflect-metadata`.

```json
// tsconfig.json
{
  "compilerOptions": {
    ...
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    ...
  },
}

```

Add `import 'reflect-metadata'` at the beginning of the entry file

```ts
// extension.ts
import 'reflect-metadata';
```

- bootstrap your extension

```ts
// extension.ts
import 'reflect-metadata';

import {ExtensionContext} from 'vscode';

import {withActivate} from 'vsc-extension-helper/hoc';

// your commands
import "./commands";

export const activate = withActivate({
  extensionId: <Your extension id>,
})(async function activate(context:ExtensionContext){
  // Maybe this method is not good at the moment, but you need to dynamically import the command code file you wrote here, otherwise the command will fail to register.
  // your code
})

```

- register some commands

Use decorator

```ts
import { command, textEditorCommand } from 'vsc-extension-helper/decorators';

// 1. use decorators
class CommandUtils {
  @command({
    name: 'command1',
  })
  command1() {
    // do something
  }

  // register text editor command: command2
  @textEditorCommand()
  command2() {
    // do something
  }
}
```

Use higher-order functions

```ts
import { withCommand, withTextEditorCommand } from 'vsc-extension-helper/hoc';

// register command3
withCommand({
  name: 'command3',
})(function command3(...args: any[]) {
  // do something
});

// register command4
withTextEditorCommand(options)(function command4(...args: any[]) {});
```

## Example

[Hello world]("./examples/hello-world")

PS: Before running the sample code, please enter the home directory to **link** the package, and then test run the plug-in.
