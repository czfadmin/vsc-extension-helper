import { TextEditor, TextEditorEdit, commands, Disposable } from 'vscode';
import { useCommands, useExtensionContext, useExtensionId } from './context';
import { CommandOptions } from './types';
import { VSC_EXTENSION_HELPER } from './constants';

/**
 * @zh 内部注册命令辅助函数
 * @en Internal registration command helper function
 * @param params
 * @param options
 * @returns
 */
export function internnalRegisterCommand(
  params: {
    cmdName: string;
    handler:
      | ((...args: any[]) => void)
      | ((editor: TextEditor, edit: TextEditorEdit, ...args: any[]) => void);
  },
  options?: CommandOptions,
) {
  const [cmds, addCommand] = useCommands();
  const extensionId = useExtensionId();
  let context = useExtensionContext();

  if (!context && options?.context) {
    context =
      typeof options.context === 'function'
        ? options.context()
        : options.context;
  }

  let { cmdName } = params;
  if (!context) {
    console.error(
      `[${VSC_EXTENSION_HELPER}] >>> (${cmdName}): Registration command failed, failed to obtain plug-in context`,
    );
    return;
  }

  if (options) {
    cmdName = options.name || params.cmdName;
  }

  const norimalizeCmdName = `${extensionId}.${cmdName}`;

  if (cmds.includes(norimalizeCmdName)) {
    console.error(
      `[${VSC_EXTENSION_HELPER}] >>> (${cmdName}): This command has already been registered, registration failed.`,
    );
    return;
  }

  let disposer: Disposable;
  if (options && options.textEditor) {
    disposer = commands.registerTextEditorCommand(
      norimalizeCmdName,
      params.handler,
    );
  } else {
    disposer = commands.registerCommand(norimalizeCmdName, params.handler);
  }

  if (!disposer) {
    return;
  }
  context.subscriptions.push(disposer);
  addCommand(norimalizeCmdName);
  console.log(
    `[${VSC_EXTENSION_HELPER}] >>> (${cmdName}): Registration succeeded`,
  );
}
