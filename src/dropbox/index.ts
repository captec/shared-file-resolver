import mime from 'mime-types'
import { getFilesInFolder, getSharedLinkMetadata } from './api'

async function getFiles(url: string, recursive?: boolean): Promise<Unshare.File[]> {
  const metadata = await getSharedLinkMetadata(url)

  if (isFolder(metadata)) {
    return listDirectory(url, recursive)
  }
  return [
    {
      name: metadata.name,
      mimeType: mime.lookup(metadata.name) || undefined,
      type: 'file',
      path: '.',
      url,
    },
  ]
}

async function listDirectory(
  url: string,
  recursive: boolean = false,
  path: string = ''
): Promise<Unshare.File[]> {
  const folder = await getFilesInFolder(url, path)
  const files: Unshare.File[] = []

  for (let i = 0; i < folder.entries.length; i++) {
    const entry = folder.entries[i]
    files.push({
      name: entry.name,
      type: isFolder(entry) ? 'folder' : 'file',
      mimeType: mime.lookup(entry.name) || undefined,
      path: `.${path}`,
      url,
    })

    if (recursive && isFolder(entry)) {
      const children = await listDirectory(url, recursive, `${path}/${entry.name}`)
      children.forEach(child => files.push(child))
    }
  }

  return files
}

function isFolder(metadata: Dropbox.Metadata): boolean {
  return metadata['.tag'] === 'folder'
}

export { getFiles }
