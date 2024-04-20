import { command } from 'vsc-extension-helper';
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
