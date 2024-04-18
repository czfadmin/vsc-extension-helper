import { ExtensionContext } from 'vscode';
import { registerContext, useExtensionContext } from './context';
import {
  WithCommandOptions,
  WithTextCommandOptions,
  WithActiveOptions,
} from './types';
import { internnalRegisterCommand } from './utils';

/**
 * @zh 通过高阶函数创建一个命令
 * @param options
 * @returns
 */
export function withCommand(options: WithCommandOptions) {
  return function (handler: (...args: any[]) => void) {
    if (!handler.name || (options && !options.name)) {
      console.error('command name is null');
      return;
    }
    const cmdName = handler.name;

    internnalRegisterCommand({ cmdName, handler }, options);
  };
}

/**
 * @zh 通过高阶函数注册`TextEditor`命令
 * @param options
 * @returns
 */
export function withTextEditorCommand(options: WithTextCommandOptions) {
  return function (handler: (...args: any[]) => void) {
    if (!handler.name || (options && !options.name)) {
      console.error('command name is null');
      return;
    }
    const cmdName = handler.name;

    internnalRegisterCommand(
      { cmdName, handler },
      {
        ...options,
        textEditor: true,
      },
    );
  };
}

type ExtensionActivateHandler = (context: ExtensionContext) => void;

/**
 * @zh 通过高阶函数将context注入到`ExtensionActivateHandler`中
 * @param handler
 * @returns
 */
export function withExtensionContext(
  handler?: (context: ExtensionContext, ...args: any[]) => any,
) {
  return function (...args: any[]) {
    const context = useExtensionContext();
    handler?.(context, ...args);
  };
}

/**
 * @zh 必须要在激活的时候, 在插件激活的时候注入上下文和插件ID并将其保存到全局变量中,保证后面可以调用
 * @param options
 * @returns
 */
export function withActivate(
  options: WithActiveOptions,
): (handler: ExtensionActivateHandler) => ExtensionActivateHandler {
  return function (handler: ExtensionActivateHandler) {
    return function (ctx: ExtensionContext) {
      registerContext({
        ...options,
        context: ctx,
      });
      handler?.(ctx);
    };
  };
}
