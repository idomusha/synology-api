/**
 * @doc https://cndl.synology.cn/download/Document/DeveloperGuide/Synology_File_Station_API_Guide.pdf#page=63&zoom=100,0,174
 */
const axios = require('axios');

/**
 * @param {string} path - File or folder to delete, use comma to separate multiple
 * @param {boolean} recursive - If false, deletion fails when folder contains files
 */
function del({
    path,
    recursive = true,
}) {
    const api = 'SYNO.FileStation.Delete';
    const reqPath = this.COMMON_PATH;

    const queryObj = {
        api,
        method: 'delete',
        version: 2,
        path,
        recursive,
    };

    const url = this.stringify({ path: reqPath, params: queryObj });
    logger.info(url);

    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(this.handleResponse.bind(this, resolve, reject))
            .catch(this.handleError.bind(this, reject));
    });
}

module.exports = del;
