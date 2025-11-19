/**
 * @doc https://cndl.synology.cn/download/Document/DeveloperGuide/Synology_File_Station_API_Guide.pdf#page=63&zoom=100,0,174
 * @TODO Proper error message when file doesn't exist
 */
const pathUtils = require('path');
const fs = require('fs');
const axios = require('axios');

/**
 * Return the last part of a file path
 * @param {string} filename
 * @return {string}
 */
function fileName(filename) {
    return pathUtils.basename(filename);
}

/**
 * Download files/folders. If only one file is specified, the file content is responded.
 * If more than one file/folder is given,
 * binary content in ZIP format which they are compressed to is responded.
 * @param {string} path - File or folder path to download, e.g. /home or /home,/videos
 * @param {string} to - Must be an absolute path that exists, e.g. ~/Documents/images
 * @param {string} [name] - Filename, defaults to the downloaded file's name
 * @param {string} [mode=open] - open|download
 */
function download({
    path,
    to,
    name,
    mode = 'download',
}) {
    const api = 'SYNO.FileStation.Download';
    const reqPath = this.COMMON_PATH;

    const queryObj = {
        api,
        method: 'download',
        version: 2,
        path,
        mode,
    };
    const url = this.stringify({ path: reqPath, params: queryObj });
    let filename = name || fileName(path);
    // If it's a directory (no extension), add .zip
    if (!filename.includes('.')) {
        filename = `${filename}.zip`;
    }
    const wholePath = pathUtils.join(to, filename);

    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url,
            responseType: 'stream',
        })
            .then((response) => {
                const writer = fs.createWriteStream(wholePath);
                response.data.pipe(writer);

                writer.on('finish', () => {
                    resolve(wholePath, response);
                });

                writer.on('error', (err) => {
                    reject(err);
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = download;
