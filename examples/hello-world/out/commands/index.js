"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandUtils = void 0;
const vsc_extension_helper_1 = require("vsc-extension-helper");
const vscode_1 = require("vscode");
class CommandUtils {
    helloWorld() {
        vscode_1.window.showInformationMessage('Hello world');
    }
    sayHello() {
        vscode_1.window.showInformationMessage('hello');
    }
}
exports.CommandUtils = CommandUtils;
__decorate([
    (0, vsc_extension_helper_1.command)({ name: 'helloWorld' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommandUtils.prototype, "helloWorld", null);
__decorate([
    (0, vsc_extension_helper_1.command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommandUtils.prototype, "sayHello", null);
//# sourceMappingURL=index.js.map