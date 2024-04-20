import { isAsyncFunction } from 'node:util/types';
import { ExtensionContext } from 'vscode';
import {
  clearGlobalContext,
  registerContext,
  useExtensionContext,
} from './context';
import { WithActiveOptions, CommandOptions, VoidHandlerType } from './types';
import { internalRegisterCommand } from './utils';

function withCommandHelper(
  optionsOrHandler: Omit<CommandOptions, 'textEditor'> | VoidHandlerType,
  isTextEditorCmd = false,
) {
  const funcPrefix = isTextEditorCmd ? 'TextEditor' : '';
  const noNameError = new Error(
    `The registered command name cannot be empty, please use \`function funcName(...args:any[]){}\` or \`with${funcPrefix}Command(options)(function funcName(...args:any[]){}\` to register Order`,
  );
  let cmdName = '';
  let internalHandler = optionsOrHandler;
  let internalOptions: CommandOptions = {};
  const paramIsHandler = typeof optionsOrHandler === 'function';
  if (paramIsHandler) {
    if (!optionsOrHandler.name) {
      throw noNameError;
    }
    internalHandler = optionsOrHandler;
    internalOptions = {
      name: optionsOrHandler.name,
      textEditor: isTextEditorCmd,
    };
    // 此时直接注册,后面的返回只是为了欺骗ts的不进行报错
    internalRegisterCommand(
      {
        ...internalOptions,
        textEditor: isTextEditorCmd,
      },
      internalHandler,
    );
  }

  return function (handler: VoidHandlerType) {
    if (
      !paramIsHandler &&
      (!handler.name || (optionsOrHandler && !optionsOrHandler.name))
    ) {
      throw noNameError;
    }
    cmdName = paramIsHandler ? cmdName : handler.name;
    internalHandler = paramIsHandler ? internalHandler : handler;
    if (!paramIsHandler) {
      internalOptions = {
        ...internalOptions,
        ...optionsOrHandler,
        textEditor: isTextEditorCmd,
      };
    }

    internalRegisterCommand(
      internalOptions,
      internalHandler as VoidHandlerType,
    );
  };
}
/**
 * @zh 通过高阶函数创建一个命令
 * @en Create a command through a higher-order function
 * @param optionsOrHandler
 * @returns
 */
export function withCommand(
  optionsOrHandler: CommandOptions | VoidHandlerType,
) {
  return withCommandHelper(optionsOrHandler, false);
}

/**
 * @zh 通过高阶函数注册`TextEditor`命令
 * @en Register the `TextEditor` command through higher-order functions
 * @param optionsOrHandler
 * @returns
 */
export function withTextEditorCommand(
  optionsOrHandler: CommandOptions | VoidHandlerType,
) {
  return withCommandHelper(optionsOrHandler, true);
}

type ExtensionActivateHandler = (
  context: ExtensionContext,
) => void | Promise<void>;

/**
 * @zh 通过高阶函数将context注入到`ExtensionActivateHandler`中
 * @en Inject context into `ExtensionActivateHandler` through higher-order functions
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
 * @en The context and plug-in ID must be injected when the plug-in is activated and saved to global variables to ensure that it can be called later.
 * @param options
 * @returns
 */
export function withActivate(
  options: WithActiveOptions,
): (handler: ExtensionActivateHandler) => ExtensionActivateHandler {
  return function (handler: ExtensionActivateHandler) {
    const _isAsyncFunction = isAsyncFunction(handler);
    if (_isAsyncFunction) {
      return async function (ctx: ExtensionContext) {
        registerContext({
          ...options,
          context: ctx,
        });
        await handler(ctx);
      };
    }

    return function (ctx: ExtensionContext) {
      registerContext({
        ...options,
        context: ctx,
      });

      handler(ctx);
    };
  };
}

/**
 * @zh 取消激活高阶函数
 * @en Cancel the deactivation higher-order function
 * @param handler 自定义的取消激活函数
 * @returns
 */
export function withDeactivate(handler?: VoidHandlerType) {
  return function (ctx: ExtensionContext) {
    clearGlobalContext();
    handler?.();
  };
}
