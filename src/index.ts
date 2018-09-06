import { ExtensionContext, LanguageClient, ServerOptions, workspace, services, TransportKind, LanguageClientOptions, WorkspaceConfiguration } from 'coc.nvim'

const sections = ['vetur', 'html', 'javascript', 'typescript', 'css', 'less', 'scss']

function getConfig(config: WorkspaceConfiguration): any {
  let res = {}
  for (let section of sections) {
    let o = config.get<any>(section)
    res[section] = o || {}
  }
  return res
}

export async function activate(context: ExtensionContext): Promise<void> {
  let { subscriptions } = context
  let c = workspace.getConfiguration()
  const config = c.get('vetur') as any
  const enable = config.enable
  if (enable === false) return
  const file = require.resolve('vue-language-server')
  if (!file) {
    workspace.showMessage('vue-language-server not found!', 'error')
    return
  }
  const selector = config.filetypes || ['vue']

  let serverOptions: ServerOptions = {
    module: file,
    args: ['--node-ipc'],
    transport: TransportKind.ipc,
    options: {
      cwd: workspace.root,
      execArgv: config.execArgv || []
    }
  }

  let clientOptions: LanguageClientOptions = {
    documentSelector: selector,
    synchronize: {
      configurationSection: sections,
      fileEvents: workspace.createFileSystemWatcher('**/*.[tj]s', true, false, true)
    },
    outputChannelName: 'vetur',
    initializationOptions: {
      config: getConfig(c)
    }
  }

  let client = new LanguageClient('vetur', 'Vetur Language Server', serverOptions, clientOptions)

  subscriptions.push(
    services.registLanguageClient(client)
  )
}
