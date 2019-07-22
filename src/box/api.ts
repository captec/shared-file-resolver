import { UnshareError } from '../utils'

const ACCESS_TOKEN = process.env.BOX_ACCESS_TOKEN

function getSharedLinkMetadata(url: string): Promise<Box.Metadata> {
  return get(
    'shared_items?fields=modified_at,path_collection,name,item_collection',
    `shared_link=${url}`
  )
}

function getFilesInFolder(id: string, url: string): Promise<Box.FilesInFolder> {
  return get(`folders/${id}/items`, `shared_link=${url}`)
}

function get<T>(endpoint: string, boxApi: string = ''): Promise<T> {
  return fetch(`https://api.box.com/2.0/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      BoxApi: boxApi,
    },
  })
    .then(response => response.json())
    .then(parseError)
    .catch(parseError)
}

function parseError<T extends Box.Response>(data: Error | Box.Error | T): T {
  if (data instanceof UnshareError) {
    throw data
  }

  if (data instanceof Error) {
    throw UnshareError.internalError('box')
  }

  if (data.type !== 'error') {
    return data as T
  }

  const error = data as Box.Error
  switch (error.code) {
    case 'incorrect_shared_item_password':
      throw UnshareError.accessDenied('box')
    case 'not_found':
      throw UnshareError.notFound('box')
    default:
      throw new UnshareError(error.code, 'box')
  }
}

export { getSharedLinkMetadata, getFilesInFolder }
