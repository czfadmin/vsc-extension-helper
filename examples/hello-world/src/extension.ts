// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import 'reflect-metadata';
import * as vscode from 'vscode';
import { withActivate, withCommand } from 'vsc-extension-helper';
import './commands/index';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

// 1.
export const activate = withActivate({
  extensionId: 'hello-world',
})(async function (ctx: vscode.ExtensionContext) {
  // 1.use hoc
  // withCommand({ name: 'foo' })(function foo() {
  //   vscode.window.showInformationMessage('foo command');
  // });

  // // 2. use hoc without options
  // withCommand(function bar(...args: any[]) {
  //   vscode.window.showInformationMessage('bar command');
  // });
});

// 2.
// export const activate = withActivate({
//   extensionId: 'hello-world',
// })(function(ctx: vscode.ExtensionContext){
//     // 1.use hoc
//     withCommand({ name: 'foo' })(function foo() {
//       vscode.window.showInformationMessage('foo command');
//     });

//     // 2. use hoc without options
//     withCommand(function bar(...args: any[]) {
//       vscode.window.showInformationMessage('bar command');
//     });
// })

// This method is called when your extension is deactivated
export function deactivate() {}
