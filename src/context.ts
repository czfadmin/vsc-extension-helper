import { ExtensionContext } from 'vscode';
import { RegisterContextOption } from './types';
import {
  EXTENSION_COMMANDS,
  EXTENSION_CONTEXT,
  EXTENSION_ID,
} from './constants';

const globalContext = new Map<
  string,
  null | ExtensionContext | string | string[]
>();

globalContext.set(EXTENSION_ID, '');
globalContext.set(EXTENSION_CONTEXT, null);
globalContext.set(EXTENSION_COMMANDS, [] as string[]);

/**
 * @zh 获取插件id
 * @en Get the plugin id
 * @returns
 */
export function useExtensionId() {
  const extensionId = globalContext.get(EXTENSION_ID);
  if (!extensionId) {
    throw new Error(
      '未发现插件ID,请在在插件启动入口处,通过`withActivate`注入插件ID',
    );
  }
  return extensionId;
}

/**
 * @zh 获取插件上下文
 * @en Get the plugin const first = useContext(second)
 * @returns
 */
export function useExtensionContext(): ExtensionContext {
  const context = globalContext.get(EXTENSION_CONTEXT);
  if (!context) {
    throw new Error(
      '未发现插件上下文,请在在插件启动入口处,通过`withActivate`注入插件上下文',
    );
  }
  return context as ExtensionContext;
}

/**
 * @zh 获取所有的命令,以及增加命令, 删除命令
 * @en Get all commands, add commands, delete commands
 * @returns
 */
export function useCommands(): [
  string[],
  (name: string) => void,
  (name: string) => void,
] {
  let cmds = globalContext.get(EXTENSION_COMMANDS) as string[];

  function addCommand(name: string) {
    cmds.push(name);
  }
  function deleteCommand(name: string) {
    cmds = cmds.filter((it: string) => it !== name);
    globalContext.set(EXTENSION_COMMANDS, cmds);
  }
  return [cmds, addCommand, deleteCommand];
}

/**
 * @zh 注册上下文
 * @en Register the context
 * @param options
 */
export function registerContext(options: RegisterContextOption) {
  globalContext.set(EXTENSION_CONTEXT, options.context);
  globalContext.set(EXTENSION_ID, options.extensionId);
}

/**
 * @zh 清除上下文
 * @en Clear the context
 */
export function clearGlobalContext() {
  const context = useExtensionContext();
  context?.subscriptions.forEach(it => it.dispose());
  globalContext.clear();
}
