export function isElectron(): boolean {
  return typeof window !== 'undefined' && !!(window as unknown as Record<string, unknown>).electronAPI
}
