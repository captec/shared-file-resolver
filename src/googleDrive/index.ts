import { getSharedLinkMetadata, getFilesInFolder } from './api'

async function getFiles(url: string, recursive?: boolean): Promise<Unshare.Entry[]> {
  const metadata = await getSharedLinkMetadata(url)

  if (isFolder(metadata)) {
    return listDirectory(metadata.id, recursive)
  }
  return [
    {
      name: metadata.name,
      type: 'file',
      mimeType: metadata.mimeType,
      url: metadata.webViewLink,
      path: '.',
    },
  ]
}

async function listDirectory(
  id: string,
  recursive: boolean = false,
  path: string = ''
): Promise<Unshare.Entry[]> {
  const folder = await getFilesInFolder(id)
  const files: Unshare.Entry[] = []

  for (let i = 0; i < folder.files.length; i++) {
    const entry = folder.files[i]

    if (isFolder(entry)) {
      let entries: Unshare.Entry[] = []

      if (recursive) {
        entries = await listDirectory(entry.id, recursive, `${path}/${entry.name}`)
      }

      files.push({
        name: entry.name,
        type: 'folder',
        url: entry.webViewLink,
        path: `.${path}`,
        entries,
      })
    } else {
      files.push({
        name: entry.name,
        type: 'file',
        mimeType: entry.mimeType,
        url: entry.webViewLink,
        path: `.${path}`,
      })
    }
  }

  return files
}

function isFolder(metadata: GoogleDrive.Metadata): boolean {
  return metadata.mimeType === 'application/vnd.google-apps.folder'
}

export { getFiles }
