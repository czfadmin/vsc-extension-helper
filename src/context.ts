import { ExtensionContext } from 'vscode';
import { WithActiveOptions } from './types';
import {
  EXTENSION_COMMANDS,
  EXTENSION_CONTEXT,
  EXTENSION_ID,
} from './constants';

const globalContext = new Map();

globalContext.set(EXTENSION_ID, '');
globalContext.set(EXTENSION_CONTEXT, null);
globalContext.set(EXTENSION_COMMANDS, [] as string[]);

/**
 * @zh 获取插件id
 * @returns
 */
export function useExtensionId() {
  return globalContext.get(EXTENSION_ID);
}

/**
 * @zh 获取插件上下文
 * @returns
 */
export function useExtensionContext() {
  return globalContext.get(EXTENSION_CONTEXT);
}

/**
 * @zh 获取所有的命令,以及增加命令, 删除命令
 * @returns
 */
export function useCommands(): [
  string[],
  (name: string) => void,
  (name: string) => void,
] {
  let cmds = globalContext.get(EXTENSION_COMMANDS);
  function addCommand(name: string) {
    cmds.push(name);
  }
  function deleteCommand(name: string) {
    cmds = cmds.filter((it: string) => it !== name);
    globalContext.set(EXTENSION_COMMANDS, cmds);
  }
  return [cmds, addCommand, deleteCommand];
}

interface RegisterContextOption extends WithActiveOptions {
  context: ExtensionContext;
}

/**
 * @zh 注册上下文
 * @param options
 */
export function registerContext(options: RegisterContextOption) {
  globalContext.set(EXTENSION_CONTEXT, options.context);
  globalContext.set(EXTENSION_ID, options.extensionId);
}
