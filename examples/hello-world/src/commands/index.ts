import { command, withCommand } from 'vsc-extension-helper';
import { window } from 'vscode';
export class CommandUtils {
  name = 'CommandUtils';

  @command({ name: 'helloWorld' })
  helloWorld() {
    window.showInformationMessage('Hello world');
  }

  @command()
  sayHello() {
    window.showInformationMessage(this.name);
  }
}

const c = new CommandUtils()

export const foo2 = withCommand({ name: 'foo2' })(function foo2() {
  window.showInformationMessage('foo2 command');
});
