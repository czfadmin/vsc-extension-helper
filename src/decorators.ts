import { CommandOptions, TextEditorCommandOptions } from './types';
import { internnalRegisterCommand } from './utils';

/**
 * @zh 用于注册vscode命令的装饰器
 * @en
 * @param options
 */
export function command(options?: CommandOptions) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const cmdName =
      typeof propertyKey === 'symbol' ? propertyKey.toString() : propertyKey;

    internnalRegisterCommand(
      {
        cmdName,
        handler: target[propertyKey],
      },
      options,
    );
  };
}

/**
 * @zh 用于注册 `textEditorCommand` 的装饰器
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

    internnalRegisterCommand(
      {
        cmdName,
        handler: target[propertyKey],
      },
      {
        ...(options || {}),
        textEditor: true,
      },
    );
  };
}
