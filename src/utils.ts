import { useCommands } from './context';
import { CommandHandlerType, CommandOptions } from './types';
import { VSC_EXTENSION_HELPER } from './constants';

/**
 * @zh 内部注册命令辅助函数. 先保存命令注册记录,然后在插件激活后进行延迟注册命令
 * @en Internal registration command helper function,First save the record, and then delay the registration of the plug-in when the plug-in is activated
 * @param params
 * @param options
 * @returns
 */
export function internalRegisterCommand(
  options: CommandOptions,
  handler: CommandHandlerType,
) {
  const [cmds, addCommand] = useCommands();
  const { name, group = [] } = options;

  if (!name) {
    throw new Error(
      `${VSC_EXTENSION_HELPER} | ${name}: Registration command failed, command name is empty`,
    );
  }

  const _name = `${group.length ? group.join('.') + '.' : ''}${name}`.trim();

  addCommand(_name, {
    ...options,
    handler,
  });
}
