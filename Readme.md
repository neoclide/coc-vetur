# coc-vetur

Vue language server extension for [coc.nvim](https://github.com/neoclide/coc.nvim).

Using [vue-language-server](https://www.npmjs.com/package/vls)

**Note:** latest vetur have changed filepath of server, make sure upgrade to
latest vetur if you're using `vetur.dev.vlsPath` configuration.

## Install

In your vim/neovim, run command:

```
:CocInstall coc-vetur
```

**Note** you have to install `eslint` and `eslint-plugin-vue` by:

```
npm i eslint eslint-plugin-vue -D
```

in your project root for this extension to work.

Make sure your workspace root is correct by `:echo g:WorkspaceFolders`

## Features

Language server features provided by [vue-language-server](https://www.npmjs.com/package/vls).

## Configuration options

- `vetur.useWorkspaceDependencies`: Use dependencies from workspace. Currently only for TypeScript., default: `false`
- `vetur.completion.autoImport`: Include completion for module export and auto import them, default: `true`
- `vetur.completion.useScaffoldSnippets`: Enable/disable Vetur's built-in scaffolding snippets, default: `true`
- `vetur.completion.tagCasing`: Casing conversion for tag completion, default: `"kebab"`
  Valid options: ["initial","kebab"]
- `vetur.validation.template`: Validate vue-html in <template> using eslint-plugin-vue, default: `true`
- `vetur.validation.style`: Validate css/scss/less/postcss in <style>, default: `true`
- `vetur.validation.script`: Validate js/ts in <script>, default: `true`
- `vetur.format.enable`: Enable/disable the Vetur document formatter., default: `true`
- `vetur.format.options.tabSize`: Number of spaces per indentation level. Inherited by all formatters., default: `2`
- `vetur.format.options.useTabs`: Use tabs for indentation. Inherited by all formatters., default: `false`
- `vetur.format.defaultFormatter.html`: Default formatter for <template> region, default: `"prettyhtml"`
  Valid options: ["none","prettyhtml","js-beautify-html","prettier"]
- `vetur.format.defaultFormatter.css`: Default formatter for <style> region, default: `"prettier"`
  Valid options: ["none","prettier"]
- `vetur.format.defaultFormatter.postcss`: Default formatter for <style lang='postcss'> region, default: `"prettier"`
  Valid options: ["none","prettier"]
- `vetur.format.defaultFormatter.scss`: Default formatter for <style lang='scss'> region, default: `"prettier"`
  Valid options: ["none","prettier"]
- `vetur.format.defaultFormatter.less`: Default formatter for <style lang='less'> region, default: `"prettier"`
  Valid options: ["none","prettier"]
- `vetur.format.defaultFormatter.stylus`: Default formatter for <style lang='stylus'> region, default: `"stylus-supremacy"`
  Valid options: ["none","stylus-supremacy"]
- `vetur.format.defaultFormatter.js`: Default formatter for <script> region, default: `"prettier"`
  Valid options: ["none","prettier","prettier-eslint","vscode-typescript"]
- `vetur.format.defaultFormatter.ts`: Default formatter for <script> region, default: `"prettier"`
  Valid options: ["none","prettier","prettier-tslint","vscode-typescript"]
- `vetur.format.defaultFormatterOptions`: Options for all default formatters, default: `{"js-beautify-html":{"wrap_attributes":"force-expand-multiline"},"prettyhtml":{"printWidth":100,"singleQuote":false,"wrapAttributes":false,"sortAttributes":false}}`
- `vetur.format.styleInitialIndent`: Whether to have initial indent for <style> region, default: `false`
- `vetur.format.scriptInitialIndent`: Whether to have initial indent for <script> region, default: `false`
- `vetur.trace.server`: Traces the communication between VS Code and Vue Language Server., default: `"off"`
  Valid options: ["off","messages","verbose"]
- `vetur.dev.vlsPath`: Path to VLS for Vetur developers. There are two ways of using it.

  1. Clone vuejs/vetur from GitHub, build it and point it to the ABSOLUTE path of `/server`.
  2. `yarn global add vue-language-server` and point Vetur to the installed location (`yarn global dir` + node_modules/vue-language-server)

- `vetur.dev.logLevel`: Log level for VLS, default: `"INFO"`
  Valid options: ["INFO","DEBUG"]
- `vetur.experimental.templateInterpolationService`: Enable template interpolation service that offers diagnostics / hover / definition / references., default: `false`

Trigger completion in `coc-settings.json` to get full list of options.

## Troubleshooting

- Add `"vetur.trace.server": "verbose"` to your `coc-settings.json` (opened by command
  `:CocConfig`) for verbose messages.
  `coc-settings.json`
- Restart coc server by command `:CocRestart`
- Make the issue happen.
- Open tsserver output channel by command `:CocCommand workspace.showOutput vetur`.

## License

MIT
