import url from 'url'

class UnshareError extends Error {
  public service: Unshare.Service | null

  public constructor(message: string, service?: Unshare.Service) {
    super(message)

    this.service = service || null
  }

  public static notFound = (service?: Unshare.Service) => new UnshareError('not_found', service)

  public static accessDenied = (service?: Unshare.Service) =>
    new UnshareError('access_denied', service)

  public static malformedLink = (service?: Unshare.Service) =>
    new UnshareError('malformed_link', service)

  public static internalError = (service?: Unshare.Service) =>
    new UnshareError('internal_error', service)

  public static foldersNotSupported = (service?: Unshare.Service) =>
    new UnshareError('folders_not_supported', service)
}

function isDropboxLink(link: string): boolean {
  const { hostname } = url.parse(link)

  return hostname === 'www.dropbox.com' || hostname === 'dropbox.com'
}

function isGoogleDriveLink(link: string): boolean {
  const { hostname } = url.parse(link)

  return hostname === 'drive.google.com'
}

function isBoxLink(link: string): boolean {
  const { hostname } = url.parse(link)

  return hostname === 'app.box.com' || hostname === 'box.com'
}

export { isDropboxLink, isGoogleDriveLink, isBoxLink, UnshareError }
