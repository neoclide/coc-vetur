"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const coc_nvim_1 = require("coc.nvim");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const sections = ['vetur', 'emmet', 'html', 'javascript', 'typescript', 'prettier', 'stylusSupremacy'];
function getConfig(config) {
    let res = {};
    for (let section of sections) {
        let o = config.get(section);
        res[section] = o || {};
    }
    return res;
}
function activate(context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let { subscriptions } = context;
        let c = coc_nvim_1.workspace.getConfiguration();
        const config = c.get('vetur');
        const enable = config.enable;
        if (enable === false)
            return;
        const file = require.resolve('vue-language-server');
        if (!file) {
            coc_nvim_1.workspace.showMessage('vue-language-server not found!', 'error');
            return;
        }
        const selector = config.filetypes || ['vue'];
        let serverOptions = {
            module: file,
            args: ['--node-ipc'],
            transport: coc_nvim_1.TransportKind.ipc,
            options: {
                cwd: coc_nvim_1.workspace.root,
                execArgv: config.execArgv || []
            }
        };
        let clientOptions = {
            documentSelector: selector,
            synchronize: {
                configurationSection: sections,
                fileEvents: coc_nvim_1.workspace.createFileSystemWatcher('**/*.[tj]s', true, false, true)
            },
            outputChannelName: 'vetur',
            initializationOptions: {
                config: getConfig(c)
            },
            middleware: {
                provideCompletionItem: (document, position, context, token, next) => {
                    return Promise.resolve(next(document, position, context, token)).then((res) => {
                        let doc = coc_nvim_1.workspace.getDocument(document.uri);
                        if (!doc)
                            return [];
                        let items = res.hasOwnProperty('isIncomplete') ? res.items : res;
                        let pre = doc.getline(position.line).slice(0, position.character);
                        // searching for class name
                        if (/(^|\s)\.\w*$/.test(pre)) {
                            items = items.filter(o => o.label.startsWith('.'));
                            items.forEach(fixItem);
                        }
                        if (context.triggerCharacter == ':'
                            || /\:\w*$/.test(pre)) {
                            items = items.filter(o => o.label.startsWith(':'));
                            items.forEach(fixItem);
                        }
                        return items;
                    });
                }
            }
        };
        let client = new coc_nvim_1.LanguageClient('vetur', 'Vetur Language Server', serverOptions, clientOptions);
        subscriptions.push(coc_nvim_1.services.registLanguageClient(client));
    });
}
exports.activate = activate;
function fixItem(item) {
    item.data = item.data || {};
    item.data.abbr = item.label;
    item.label = item.label.slice(1);
    item.textEdit = null;
    item.insertTextFormat = vscode_languageserver_protocol_1.InsertTextFormat.PlainText;
}
//# sourceMappingURL=index.js.map