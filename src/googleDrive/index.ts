import { getSharedLinkMetadata, getFilesInFolder } from './api'

async function getFiles(url: string, recursive?: boolean): Promise<Unshare.File[]> {
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
): Promise<Unshare.File[]> {
  const folder = await getFilesInFolder(id)
  const files: Unshare.File[] = []

  for (let i = 0; i < folder.files.length; i++) {
    const entry = folder.files[i]

    files.push({
      name: entry.name,
      type: isFolder(entry) ? 'folder' : 'file',
      mimeType: entry.mimeType,
      url: entry.webViewLink,
      path: `.${path}`,
    })

    if (recursive && isFolder(entry)) {
      const children = await listDirectory(entry.id, recursive, `${path}/${entry.name}`)
      children.forEach(child => files.push(child))
    }
  }

  return files
}

function isFolder(metadata: GoogleDrive.Metadata): boolean {
  return metadata.mimeType === 'application/vnd.google-apps.folder'
}

export { getFiles }
