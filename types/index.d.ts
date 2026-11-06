export type IsOpen = boolean

declare module 'claude-code' {
  interface PluginState {
    'usage-band': { isOpen: IsOpen }
  }
}
