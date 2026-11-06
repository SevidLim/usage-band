import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const LIMIT = 600_000
const isOpen = atom({ plugin: 'usage-band', key: 'isOpen' } as const, false)

const fmt = (n: number) => n.toLocaleString('en-US')

export const register: Register = on => {
  // 每次送出訊息時，把目前用量附在訊息最後，讓對話中的 AI 讀得到；同時收合用量列。
  on('prompt.submit', async ($, e, next) => {
    await update($, isOpen, () => false).catch(() => undefined)
    const usage = await $.session.usage().catch(() => null)
    const context = usage?.context
    if (context?.tokens === undefined) return next(e)
    const over = context.tokens >= LIMIT
    const note = `\n\n[usage-band] 目前對話用量 ${fmt(context.tokens)} tokens，門檻 ${fmt(LIMIT)}${over ? '，已達門檻：請確認能否再完成一張票，否則執行 project-update 並準備交接。' : '。'}`
    return next({ ...e, text: e.text + note })
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)
    const open = await read($, isOpen)
    const toggle = () => update($, isOpen, v => !v)
    if (!open) {
      return (
        <Box justifyContent="center">
          <Button key="open" label="^" onPress={toggle} />
        </Box>
      )
    }
    const { context } = await $.session.usage()
    const tokens = context.tokens ?? 0
    const left = LIMIT - tokens
    return (
      <Box justifyContent="center">
        <Text>
          用量 {fmt(tokens)} / {fmt(LIMIT)}　{left > 0 ? `剩 ${fmt(left)}` : `超過 ${fmt(-left)}`}　{' '}
        </Text>
        <Button key="close" label="v" onPress={toggle} />
      </Box>
    )
  })
}
