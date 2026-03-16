export const RELEASE_VERSION = '0.4.0'
export const GITHUB_REPO = 'open-neo/openneo'
export const STORAGE_BUCKET = 'open-neo.firebasestorage.app'

export function getDownloadUrl(version: string = RELEASE_VERSION): string {
  const filename = `OpenNeo-${version}-arm64.dmg`
  return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/installers%2Fv${version}%2F${filename}?alt=media`
}

export function getGitHubDownloadUrl(version: string = RELEASE_VERSION): string {
  const filename = `OpenNeo-${version}-arm64.dmg`
  return `https://github.com/${GITHUB_REPO}/releases/download/v${version}/${filename}`
}
