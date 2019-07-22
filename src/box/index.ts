import mime from 'mime-types'
import { getSharedLinkMetadata, getFilesInFolder } from './api'

async function getFiles(url: string, recursive?: boolean): Promise<Unshare.File[]> {
  const metadata = await getSharedLinkMetadata(url)

  if (isFolder(metadata)) {
    return listDirectory(metadata.id, url, recursive)
  }

  return [
    {
      name: metadata.name,
      type: 'file',
      path: '.',
    },
  ]
}

async function listDirectory(
  id: string,
  url: string,
  recursive: boolean = false,
  path: string = ''
): Promise<Unshare.File[]> {
  const folder = await getFilesInFolder(id, url)
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
      const children = await listDirectory(entry.id, url, recursive, `${path}/${entry.name}`)
      children.forEach(child => files.push(child))
    }
  }
  return files
}

function isFolder(metadata: Box.Metadata): boolean {
  return metadata.type === 'folder'
}

export { getFiles }
