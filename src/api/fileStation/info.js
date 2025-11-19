/**
 * @doc https://cndl.synology.cn/download/Document/DeveloperGuide/Synology_File_Station_API_Guide.pdf#page=63&zoom=100,0,174
 */
const axios = require('axios');
/**
 * Provide File Station information
 * @return {Promise}
 */
function info() {
    const api = 'SYNO.FileStation.Info';
    const path = this.COMMON_PATH;
    const queryObj = {
        api,
        method: 'get',
        version: 2,
    };
    const url = this.stringify({ path, params: queryObj });
    logger.info(url);
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(this.handleResponse.bind(this, resolve, reject))
            .catch(this.handleError.bind(this, reject));
    });
}

module.exports = info;
