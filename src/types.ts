import { ExtensionContext, TextEditor, TextEditorEdit } from 'vscode';
/**
 * @zh 带注册命令配置
 *
 */
export interface CommandOptions {
  /**
   * @zh 自定义命令名称, 否则使用函数的名字, 不包含插件ID
   * @en Customize the command name, otherwise use the function name
   */
  name?: string;

  /**
   * @zh 命令分组, 传递字符串数组, 后续命令生成的时候进行拼接, 如: 插件ID.group1.group2.commandName
   * @en Command group, pass in a string array, and then concatenate when the command is generated later
   */
  group?: string[];
  /**
   * @zh 是否注册为`TextEditor` 命令
   * @en Whether to use the `registerTextEditorCommand` method
   */
  textEditor?: boolean;

  /**
   * @zh 获取插件运行上下文方法
   * @en Obtain the plug-in running context and customize the function to obtain the context
   */
  context?: ExtensionContext | (() => ExtensionContext);
}

/**
 * @zh 代表命令处理函数
 */
export type CommandHandlerType =
  | ((...args: any[]) => void)
  | ((editor: TextEditor, edit: TextEditorEdit, ...args: any[]) => void);

/**
 * @zh 命令配置
 */
export interface InternalCommandOption {
  /**
   * @zh 命令ID
   */
  name: string;

  options: CommandOptions;

  /**
   * @zh 命令处理函数
   */
  handler: CommandHandlerType;
}

export type TextEditorCommandOptions = Omit<CommandOptions, 'textEditor'>;

export interface IVoidHandler {
  group?: string | string[];

  (...args: any[]): void;
}

export interface WithActiveOptions {
  extensionId: string;
  logger?: boolean;
}

export interface RegisterContextOption extends WithActiveOptions {
  context: ExtensionContext;
}
