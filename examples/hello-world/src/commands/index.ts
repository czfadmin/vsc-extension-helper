import { command, withCommand } from 'vsc-extension-helper';
import { window } from 'vscode';
export class CommandUtils {
  @command({ name: 'helloWorld' })
  helloWorld() {
    window.showInformationMessage('Hello world');
  }

  @command()
  sayHello() {
    window.showInformationMessage('hello');
  }
}

export const foo2 = withCommand({ name: 'foo2' })(function foo2() {
  window.showInformationMessage('foo2 command');
})
