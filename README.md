# synology-api

A wrapper for the Synology FileStation API, making it easy to call. Unlike other similar libraries, this one supports file uploads.

## Fork Notice

This is a fork of [ltaoo/synology-api](https://github.com/ltaoo/synology-api).

### Changes from upstream:

#### v1.5.0
- Fixed list method

#### v1.6.0
- Replaced `request` with `axios` to fix critical security vulnerabilities
- Translated all comments to English
- Updated dependencies to latest secure versions

## Installation

```bash
npm install @idomusha/synology
```

## Usage

### Init

- Internal IP

```js
const Synology = require('@idomusha/synology');

const synology = new Synology({
    protocol: 'http',
    host: '192.168.1.4',
    port: 5000
});
```

- External URL

```js
const synology = new Synology({
    protocol: 'https',
    host: 'john.synology.me',
    port: 5001
});
```

### Login

```js
async function init() {
    try {
        await synology.Auth.auth({
            username: USERNAME,
            password: PASSWORD
        });
    } catch (err) {
        console.error(err);
    }
}

init();
```

All methods below must be used after successful login.

### Upload

```js
await synology.FileStation.upload({
    path: '/home',
    file: path.join(__dirname, './example.jpg')
    // Supports downloading network images
    // If the URL doesn't have an extension, you must add the name parameter
    // file: 'http://example.com/image.jpg',
    // name: 'xxx.jpg',
});
```

### Download

```js
await synology.FileStation.download({
    path: '/home/6xmt_b.jpg',
    to: path.join(__dirname, './image/example1.jpg'),
    mode: 'download'
});
```

### Search

```js
const data = await synology.FileStation.search({
    folder_path: '/home',
    pattern: '6x' // filename pattern to search
});
console.log(data);
```

### Create Folder

```js
await synology.FileStation.createFolder({
    folder_path: '/home',
    name: 'test'
});
```

### Rename

```js
await synology.FileStation.rename({
    path: '/home/6xmt_b.jpg',
    name: 'e.jpg'
});
```

### Move or Copy

```js
await synology.FileStation.copyMove({
    path: '/home/e.jpg',
    dest_folder_path: '/home/test1'
});
```

### Delete

```js
await synology.FileStation.delete({
    path: '/home/test1/e.jpg'
});
```

## Example

Create a `.env` file in the project root with the following content:

```
ACCOUNT = your account username
PASSWD = your account password
HOST = host like 192.168.1.4
PORT = 5000
NODE_ENV = dev
```

Then run `node example/index.js`. The terminal will display the current request URL and result.
If you see `auth success {"data":{"sid":"jiEIqBgVWZuCU1840QMRH4C3AV"},"success":true}`, login was successful.

## TODO

- [x] Use custom logging instead of console.log

### Download

- [ ] Return proper error message when file doesn't exist

## References

- [How can I upload a file to a Synology diskstation with PHP](https://stackoverflow.com/questions/45137195/how-can-i-upload-a-file-to-a-synology-diskstation-with-php/48637467#48637467)

## License

MIT
