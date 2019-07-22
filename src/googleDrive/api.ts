import { google } from 'googleapis'
import { snakeCase } from 'change-case'
import { UnshareError } from '../utils'

const API_KEY = process.env.GOOGLE_DRIVE_API_KEY

async function getSharedLinkMetadata(url: string): Promise<GoogleDrive.Metadata> {
  const id = extractId(url)

  if (!id) {
    throw UnshareError.malformedLink('google_drive')
  }

  try {
    const drive = google.drive({
      version: 'v3',
      auth: API_KEY,
    })

    const response = await drive.files.get({ fileId: id, fields: '*' })
    return response.data as GoogleDrive.Metadata
  } catch (error) {
    parseError(error)
  }

  throw UnshareError.notFound('google_drive')
}

async function getFilesInFolder(id: string): Promise<GoogleDrive.FilesInFolder> {
  try {
    const drive = google.drive({ version: 'v3', auth: API_KEY })

    /* eslint-disable id-length */
    const response = await drive.files.list({
      q: `'${id}' in parents`,
      fields: '*',
    })
    /* eslint-enable id-length */

    return response.data as GoogleDrive.FilesInFolder
  } catch (error) {
    parseError(error)
  }

  throw UnshareError.notFound('google_drive')
}

function extractId(url: string): string | null {
  const matches = url.match(/(?:folders\/|id=)([a-zA-Z0-9]*)/u)

  if (!matches || matches.length !== 2) {
    return null
  }

  return matches[1]
}

function parseError(error: Error | GoogleDrive.Error): void {
  if (error instanceof Error) {
    throw UnshareError.internalError('google_drive')
  }

  const reason = error.errors[0].reason

  switch (reason) {
    case 'notFound':
      throw UnshareError.notFound('google_drive')
    case 'keyInvalid':
      throw UnshareError.internalError('google_drive')
    default:
      throw new UnshareError(snakeCase(reason), 'google_drive')
  }
}

export { getSharedLinkMetadata, getFilesInFolder }
