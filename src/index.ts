import { ExtensionContext, LanguageClient, ServerOptions, workspace, services, TransportKind, LanguageClientOptions, WorkspaceConfiguration, ProvideCompletionItemsSignature } from 'coc.nvim'
import { TextDocument, Position, CompletionItem, CompletionList, InsertTextFormat, DocumentSelector } from 'vscode-languageserver-protocol'
import { CompletionContext } from 'vscode-languageserver-protocol'
import { CancellationToken } from 'vscode-jsonrpc'
import fs from 'fs'
import path from 'path'
declare var __webpack_require__: any
declare var __non_webpack_require__: any
const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require

const sections = ['vetur', 'emmet', 'html', 'javascript', 'typescript', 'prettier', 'stylusSupremacy']

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
  let file: string
  let devPath = config.dev && config.dev.vlsPath // config.get<string>('dev.vlsPath', null)
  if (devPath && fs.existsSync(devPath)) {
    file = path.join(devPath, 'dist/vueServerMain.js')
    if (!fs.existsSync(file)) {
      workspace.showMessage(`vetur server module "${file}" not found!`, 'error')
      return
    }
  } else {
    file = requireFunc.resolve('vue-language-server')
    if (!file) {
      workspace.showMessage('vue-language-server module not found!', 'error')
      return
    }
  }
  const selector: DocumentSelector = [{
    language: 'vue',
    scheme: 'file'
  }]

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
    },
    middleware: {
      provideCompletionItem: (
        document: TextDocument,
        position: Position,
        context: CompletionContext,
        token: CancellationToken,
        next: ProvideCompletionItemsSignature
      ) => {
        return Promise.resolve(next(document, position, context, token)).then((res: CompletionItem[] | CompletionList) => {
          let doc = workspace.getDocument(document.uri)
          if (!doc || !res) return []
          let items: CompletionItem[] = res.hasOwnProperty('isIncomplete') ? (res as CompletionList).items : res as CompletionItem[]
          let pre = doc.getline(position.line).slice(0, position.character)
          // searching for class name
          if (/(^|\s)\.\w*$/.test(pre)) {
            items = items.filter(o => o.label.startsWith('.'))
            items.forEach(fixItem)
          }
          if (context.triggerCharacter == ':'
            || /\:\w*$/.test(pre)) {
            items = items.filter(o => o.label.startsWith(':'))
            items.forEach(fixItem)
          }
          return items
        })
      }
    }
  }

  let client = new LanguageClient('vetur', 'Vetur Language Server', serverOptions, clientOptions)
  client.onReady().then(() => {
    registerCustomClientNotificationHandlers(client)
  }).catch(_e => {
    // noop
  })

  subscriptions.push(
    services.registLanguageClient(client)
  )
}

function registerCustomClientNotificationHandlers(client: LanguageClient): void {
  client.onNotification('$/displayInfo', (msg: string) => {
    workspace.showMessage(msg, 'more')
  })
  client.onNotification('$/displayWarning', (msg: string) => {
    workspace.showMessage(msg, 'warning')
  })
  client.onNotification('$/displayError', (msg: string) => {
    workspace.showMessage(msg, 'error')
  })
}

function fixItem(item: CompletionItem): void {
  item.data = item.data || {}
  item.data.abbr = item.label
  item.label = item.label.slice(1)
  item.textEdit = null
  item.insertTextFormat = InsertTextFormat.PlainText
}
