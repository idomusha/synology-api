/**
 * @doc https://cndl.synology.cn/download/Document/DeveloperGuide/Synology_File_Station_API_Guide.pdf#page=63&zoom=100,0,174
 */
const axios = require('axios');

/**
 * Rename a file/folder
 * @param {string} path - Full path of file or folder to rename, use comma to separate multiple
 * @param {string} name - New name for file or folder, don't include path, use comma to separate multiple (corresponds to path)
 * @param {string} [additional]
 * @param {string} [search_taskid] - Used with search to rename found files or folders
 */
function rename(params) {
    const api = 'SYNO.FileStation.Rename';
    const path = this.COMMON_PATH;

    const queryObj = {
        api,
        method: 'rename',
        version: 2,
        ...params,
    };

    const url = this.stringify({ path, params: queryObj });
    logger.info(url);
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(this.handleResponse.bind(this, resolve, reject))
            .catch(this.handleError.bind(this, reject));
    });
}

module.exports = rename;
