import { NowRequest, NowResponse } from '@now/node'
import { isDropboxLink, isGoogleDriveLink, isBoxLink } from './utils'
import * as dropbox from './dropbox'
import * as googleDrive from './googleDrive'
import * as box from './box'

async function lambda(req: NowRequest, res: NowResponse): Promise<void> {
  const sharinglink: string = req.query.sharinglink as string
  const recursive: boolean = Boolean(req.query.recursive)

  if (!sharinglink) {
    res.statusCode = 401
    res.send({ error: 'missing_sharing_link_parameter', service: null })
    return
  }

  let promise: Promise<Unshare.File[]> | null = null
  if (isDropboxLink(sharinglink)) {
    promise = dropbox.getFiles(sharinglink, recursive)
  } else if (isGoogleDriveLink(sharinglink)) {
    promise = googleDrive.getFiles(sharinglink, recursive)
  } else if (isBoxLink(sharinglink)) {
    promise = box.getFiles(sharinglink, recursive)
  } else {
    res.send({ error: 'unrecognized_sharing_link', service: null, statusCode: 401 })
    return
  }

  try {
    const files = await promise
    res.send(files)
  } catch (error) {
    res.send({ error: error.message, service: error.service, statusCode: 401 })
  }
}

export default lambda
