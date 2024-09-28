import { Disposable, ExtensionContext, commands } from 'vscode';
import {
  CommandHandlerType,
  CommandOptions,
  InternalCommandOption,
  RegisterContextOption,
} from './types';
import {
  EXTENSION_COMMANDS,
  EXTENSION_CONTEXT,
  EXTENSION_ID,
  VSC_EXTENSION_HELPER,
} from './constants';

const globalContext = new Map<
  string,
  null | ExtensionContext | string | InternalCommandOption[]
>();

// 保存上下文ID
globalContext.set(EXTENSION_ID, '');
// 保存上下文
globalContext.set(EXTENSION_CONTEXT, null);

// 保存全局命令注册信息
globalContext.set(EXTENSION_COMMANDS, [] as InternalCommandOption[]);

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
  InternalCommandOption[],
  (
    command: string,
    options: CommandOptions & { handler: CommandHandlerType },
  ) => void,
  (command: string) => void,
] {
  let cmds = globalContext.get(EXTENSION_COMMANDS) as InternalCommandOption[];

  function addCommand(
    name: string,
    options: CommandOptions & { handler: CommandHandlerType },
  ) {
    if (cmds.find(it => it.name === name)) {
      console.error(
        `${VSC_EXTENSION_HELPER} | ${name}: This command has already been registered, registration failed.`,
      );
      return;
    }

    const { handler, ...rest } = options;
    cmds.push({
      name,
      options: rest,
      handler: handler,
    });
  }
  function deleteCommand(name: string) {
    cmds = cmds.filter(it => it.name !== name);
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
 * @zh 开始注册使用装饰器和高阶函数注册的命令
 */
export function registerCommands() {
  const extensionId = globalContext.get(EXTENSION_ID) as string;
  const cmds = globalContext.get(EXTENSION_COMMANDS) as InternalCommandOption[];
  const context = useExtensionContext();
  cmds.forEach(it => {
    let disposer: Disposable | null;
    const commandName = `${extensionId}.${it.name}`;
    if (!it.options.textEditor) {
      disposer = commands.registerCommand(commandName, it.handler);
    } else {
      disposer = commands.registerTextEditorCommand(commandName, it.handler);
    }
    if (!disposer && context) {
      context.subscriptions.push(disposer);
    }
    console.log(
      `${VSC_EXTENSION_HELPER} | ${commandName}: Registration succeeded`,
    );
  });
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
