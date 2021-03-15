import { LanguageClient, window, workspace } from 'coc.nvim'
import path from 'path'

export function generateDoctorCommand(client: LanguageClient) {
  return async () => {
    const { document } = await workspace.getCurrentState()
    const fileName = path.basename(document.uri)

    if (!fileName.endsWith('.vue')) {
      return window.showInformationMessage(
        'Failed to doctor. Make sure the current file is a .vue file.'
      )
    }

    const result = (await client.sendRequest('$/doctor', {
      fileName
    })) as string

    await workspace.nvim
      .command(
        'belowright vnew vetur-doctor-info | setlocal buftype=nofile bufhidden=hide noswapfile filetype=json'
      )
      .then(async () => {
        const buf = await workspace.nvim.buffer
        buf.setLines(result.split('\n'), { start: 0, end: -1 })
      })
  }
}
