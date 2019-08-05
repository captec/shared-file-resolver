import mime from 'mime-types'
import { getSharedLinkMetadata, getFilesInFolder } from './api'

const MAX_RECURSION_DEPTH = parseInt(process.env.MAX_RECURSION_DEPTH || '1', 10) || 1

async function getFiles(url: string, recursive?: boolean): Promise<Unshare.Entry[]> {
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
  path: string = '',
  depth: number = 0
): Promise<Unshare.Entry[]> {
  const folder = await getFilesInFolder(id, url)
  const files: Unshare.Entry[] = []

  for (let i = 0; i < folder.entries.length; i++) {
    const entry = folder.entries[i]

    if (isFolder(entry)) {
      let entries: Unshare.Entry[] = []
      if (recursive && depth < MAX_RECURSION_DEPTH) {
        entries = await listDirectory(entry.id, url, recursive, `${path}/${entry.name}`, depth + 1)
      }

      files.push({
        name: entry.name,
        type: 'folder',
        path: `.${path}`,
        url,
        entries,
      })
    } else {
      files.push({
        name: entry.name,
        type: 'file',
        mimeType: mime.lookup(entry.name) || undefined,
        path: `.${path}`,
        url,
      })
    }
  }

  return files
}

function isFolder(metadata: Box.Metadata): boolean {
  return metadata.type === 'folder'
}

export { getFiles }
