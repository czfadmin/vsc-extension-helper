import { CommandOptions, TextEditorCommandOptions } from './types';
import { internalRegisterCommand } from './utils';

/**
 * @zh 用于注册vscode命令的装饰器
 * @en This method decorator is used to register methods in a class as vscode commands
 * @param options
 */
export function command(options?: Omit<CommandOptions, 'textEditor'>) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const cmdName =
      typeof propertyKey === 'symbol' ? propertyKey.toString() : propertyKey;

    const name = options?.name || cmdName;
    const _options = { ...(options || {}), name, textEditor: false };

    internalRegisterCommand(_options, target[propertyKey]);
  };
}

/**
 * @zh 用于注册 `textEditorCommand` 的装饰器
 * @en Decorator for registering `textEditorCommand`
 * @param options
 * @returns
 */
export function textEditorCommand(options?: TextEditorCommandOptions) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const cmdName =
      typeof propertyKey === 'symbol' ? propertyKey.toString() : propertyKey;
    const name = options?.name || cmdName;
    const _options = { ...(options || {}), name, textEditor: true };

    internalRegisterCommand(_options, target[propertyKey]);
  };
}
