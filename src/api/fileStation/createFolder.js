/**
 * @doc https://cndl.synology.cn/download/Document/DeveloperGuide/Synology_File_Station_API_Guide.pdf#page=63&zoom=100,0,174
 */
const axios = require('axios');

/**
 * Create folders
 * @param {string} folder_path - Parent folder for the new folder
 * If force_parent = true and this folder doesn't exist, it will be created
 * @param {string} name - Name of the new folder
 * @param {boolean} [force_parent=false]
 * @param {string} additional - Additional info to include in result
 */
function createFolder(params) {
    const api = 'SYNO.FileStation.CreateFolder';
    const path = this.COMMON_PATH;

    const queryObj = {
        api,
        method: 'create',
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

module.exports = createFolder;
