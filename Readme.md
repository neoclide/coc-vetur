# coc-vetur

Vue language server extension for [coc.nvim](https://github.com/neoclide/coc.nvim).

Using [vue-language-server](https://www.npmjs.com/package/vue-language-server)

## Install

In your vim/neovim, run command:

```
:CocInstall coc-vetur
```

## Features

Language server features provided by [vue-language-server](https://www.npmjs.com/package/vue-language-server).

## Configuration options

* `vetur.enable` set to `false` to disable vue language server.
* `vetur.trace.server` trace LSP traffic in output channel.
* `vetur.execArgv` add `execArgv` to `child_process.spawn`
* `vetur.filetypes` filetypes for vetur, default `['vue']`

Trigger completion in `coc-settings.json` to get full list of options.

## License

MIT
