declare namespace Unshare {
  type Service = 'dropbox' | 'google_drive' | 'box'

  type Entry = File | Folder

  type File = {
    name: string
    type: 'file'
    path: string
    url?: string
    mimeType?: string
  }

  type Folder = {
    name: string
    type: 'folder'
    path: string
    url?: string
    entries: Entry[]
  }
}

declare namespace Dropbox {
  type Metadata = {
    '.tag': 'file' | 'folder'
    name: string
    id: string
  }

  type FilesInFolder = {
    entries: Metadata[]
  }

  type Response = {
    error_summary?: string
    error?: {
      '.tag': string
    }
  }
}

declare namespace GoogleDrive {
  type Error = {
    errors: {
      reason: string
    }[]
  }

  type Metadata = {
    id: string
    name: string
    mimeType: string
    webViewLink: string
  }

  type FilesInFolder = {
    files: Metadata[]
  }
}

declare namespace Box {
  type Response = {
    type: string
  }

  type Error = {
    type: 'error'
    code: string
    message: string
  } & Response

  type Metadata = {
    id: string
    type: 'folder' | 'file'
    name: string
  } & Response

  type FilesInFolder = {
    entries: Box.Metadata[]
  }
}

declare module 'mime-types' {
  type Lookup = (input: string) => false | string

  type Mime = {
    lookup: Lookup
  }

  export default {} as Mime
}
