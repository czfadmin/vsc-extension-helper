import { Disposable, ExtensionContext, commands } from 'vscode';
import {
  CommandHandlerType,
  CommandOptions,
  InternalCommandOption,
  RegisterContextOption,
  WithActiveOptions,
} from './types';
import { VSC_EXTENSION_HELPER } from './constants';

export type GlobalContextType = WithActiveOptions & {
  commands: InternalCommandOption[];
  context: ExtensionContext | null;
};

const globalContext: GlobalContextType = {
  context: null,
  commands: [],
  extensionId: '',
};

export function useGlobalContext(): GlobalContextType {
  return globalContext;
}

/**
 * @zh 获取插件id
 * @en Get the plugin id
 * @returns
 */
export function useExtensionId() {
  const config = useGlobalContext();
  if (!config.extensionId) {
    throw new Error(
      '未发现插件ID,请在在插件启动入口处,通过`withActivate`注入插件ID',
    );
  }
  return config.extensionId;
}

/**
 * @zh 获取插件上下文
 * @en Get the plugin const first = useContext(second)
 * @returns
 */
export function useExtensionContext(): ExtensionContext {
  const { context } = useGlobalContext();
  if (!context) {
    throw new Error(
      '未发现插件上下文,请在在插件启动入口处,通过`withActivate`注入插件上下文',
    );
  }
  return context;
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
  function addCommand(
    name: string,
    options: CommandOptions & { handler: CommandHandlerType },
  ) {
    if (globalContext.commands.find(it => it.name === name)) {
      console.error(
        `${VSC_EXTENSION_HELPER} | ${name}: This command has already been registered, registration failed.`,
      );
      return;
    }

    const { handler, ...rest } = options;
    globalContext.commands.push({
      name,
      options: rest,
      handler,
    });
  }
  function deleteCommand(name: string) {
    globalContext.commands = globalContext.commands.filter(
      it => it.name !== name,
    );
  }
  return [globalContext.commands, addCommand, deleteCommand];
}

/**
 * @zh 注册上下文
 * @en Register the context
 * @param options
 */
export function registerContext(options: RegisterContextOption) {
  globalContext.context = options.context;
  globalContext.extensionId = options.extensionId;
  globalContext.logger = options.logger || false;
}

/**
 * @zh 开始注册使用装饰器和高阶函数注册的命令
 */
export function registerCommands() {
  const context = useExtensionContext();
  globalContext.commands.forEach(it => {
    let disposer: Disposable | null;
    const commandName = `${globalContext.extensionId}.${it.name}`;
    if (!it.options.textEditor) {
      disposer = commands.registerCommand(commandName, it.handler);
    } else {
      disposer = commands.registerTextEditorCommand(commandName, it.handler);
    }
    if (!disposer && context) {
      context.subscriptions.push(disposer);
    }
    globalContext.logger &&
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
  globalContext.commands.length = 0;
  globalContext.context = null;
  globalContext.extensionId = '';
}
