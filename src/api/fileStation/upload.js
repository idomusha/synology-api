/**
 * @doc https://cndl.synology.cn/download/Document/DeveloperGuide/Synology_File_Station_API_Guide.pdf#page=63&zoom=100,0,174
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

/**
 * Get the filename for upload
 * @param {*} p
 * @param {*} defaultName
 */
function basename(p, defaultName) {
    if (defaultName) {
        return defaultName;
    }
    if (p.slice(0, 4) === 'http') {
        const paths = p.split('/');
        const filename = paths[paths.length - 1];
        // If there's no filename, generate a random one, but we don't know the extension
        if (!filename.includes('.')) {
            return Date.now().toString();
        }
        return filename;
    }
    return path.basename(p);
}

/**
 * Upload file
 * @param {UploadOptions} params
 * @param {string} params.path - Target directory for upload
 * @param {string} params.file - File path to upload
 * @param {string} [name] - Filename, required if URL doesn't have an extension
 * @param {string} [params.overwrite=false] - Whether to overwrite if file exists
 * @return {Promise}
 */
function upload(params) {
    const api = 'SYNO.FileStation.Upload';
    const reqPath = this.COMMON_PATH;

    const queryObj = {
        api,
        method: 'upload',
        version: 2,
    };

    const url = this.stringify({ path: reqPath, params: queryObj });
    logger.info(url);

    return new Promise(async (resolve, reject) => {
        try {
            const form = new FormData();
            const { file, name, ...restParams } = params;

            // Append all other params to form
            Object.keys(restParams).forEach((key) => {
                const value = restParams[key];
                form.append(key, String(value));
            });

            // Handle file specially
            const filename = basename(file, name);
            let fileStream;

            // If it's a URL, fetch it first
            if (file.slice(0, 4) === 'http') {
                const response = await axios.get(file, { responseType: 'stream' });
                fileStream = response.data;
            } else {
                fileStream = fs.createReadStream(file);
            }

            form.append('file', fileStream, { filename });

            // Make the upload request
            const response = await axios.post(url, form, {
                headers: {
                    ...form.getHeaders(),
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });

            const body = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
            this.handleResponse(resolve, reject, { data: body });
        } catch (err) {
            this.handleError(reject, err);
        }
    });
}

module.exports = upload;
