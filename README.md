<h1 align="center">Shared File Resolver</h1>

## Getting started

**Install**

```sh
yarn
```

**Run locally**

```sh
yarn dev
```

## Usage

The Unshare service consists of a single endpoint to resolve "shared file links" from various services including Dropbox, Google Drive and Box. You can try the endpoint at https://unshare.nanninga.now.sh/playground to see the request and response.

### Parameters

| parameter     | description                                                          | type      |
| ------------- | -------------------------------------------------------------------- | --------- |
| `sharinglink` | Sharing link to the file or folder to get information from           | `string`  |
| `recursive`   | Recursively fetch files and folders if the original link is a folder | `boolean` |
| `hidefolder`  | Hide folders from the output array, show only files                  | `boolean` |

## Environment variables

Environment variables can either be set on a per command basis, or on a `.env` file. See `.env.sample` for a reference on the format.

### Production

Environment variables for production need to be set using [now secret](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets).

```sh
now secret add unshare-dropbox-access-token <token>
now secret add unshare-google-drive-api-key <key>
now secret add unshare-box-access-token <token>
```

## Deploy

This application is deployed on zeit.co [now](https://zeit.co/docs).

```sh
yarn deploy
```
