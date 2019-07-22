import fetch from 'isomorphic-fetch'
import { UnshareError } from '../utils'

const ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN

function getSharedLinkMetadata(url: string): Promise<Dropbox.Metadata> {
  return post<Dropbox.Metadata>('sharing/get_shared_link_metadata', { url })
}

function getFilesInFolder(url: string, path: string = ''): Promise<Dropbox.FilesInFolder> {
  /* eslint-disable camelcase */
  return post<Dropbox.FilesInFolder>('files/list_folder', {
    path,
    shared_link: { url },
    include_media_info: true,
  })
  /* eslint-enable camelcase */
}

function post<T>(endpoint: string, body: object): Promise<T> {
  return fetch(`https://api.dropboxapi.com/2/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(response => response.json())
    .then(parseError)
    .catch(parseError)
}

function parseError<T extends Dropbox.Response>(data: Error | T): T {
  if (data instanceof UnshareError) {
    throw data
  }

  if (data instanceof Error) {
    throw UnshareError.internalError('dropbox')
  }

  if (data.error) {
    switch (data.error['.tag']) {
      case 'shared_link_access_denied':
        throw UnshareError.accessDenied('dropbox')
      default:
        throw new UnshareError(data.error['.tag'], 'dropbox')
    }
  }

  return data
}

export { getSharedLinkMetadata, getFilesInFolder }
