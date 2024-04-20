"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
require("reflect-metadata");
const vscode = __importStar(require("vscode"));
const vsc_extension_helper_1 = require("vsc-extension-helper");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
// 1.
exports.activate = (0, vsc_extension_helper_1.withActivate)({
    extensionId: 'hello-world',
})(async function (ctx) {
    // import your command functions here
    await import('./commands/index.js');
    // 1.use hoc
    (0, vsc_extension_helper_1.withCommand)({ name: 'foo' })(function foo() {
        vscode.window.showInformationMessage('foo command');
    });
    // 2. use hoc without options
    (0, vsc_extension_helper_1.withCommand)(function bar(...args) {
        vscode.window.showInformationMessage('bar command');
    });
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
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map