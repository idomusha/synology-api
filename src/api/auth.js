/**
 * @file 认证相关的接口
 * @author ltaoo<litaowork@aliyun.com>
 * @doc https://cndl.synology.cn/download/Document/DeveloperGuide/Synology_File_Station_API_Guide.pdf#page=63&zoom=100,0,174
 */
const axios = require('axios');
const { appendErrorMessage, exportModules } = require('../utils');
/**
 * @param {string} username
 * @param {string} password
 * @return {Promise}
 */
function auth({
    username,
    account,
    password,
    passwd,

    format = 'sid',
}) {
    const api = 'SYNO.API.Auth';
    const path = '/auth.cgi';
    const params = {
        api,
        method: 'login',
        version: 3,
        account: username || account,
        passwd: password || passwd,
        session: 'FileStation',
        format,
    };
    const url = this.stringify({ path, params });
    logger.info(url);
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then((response) => {
                const body = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
                const content = appendErrorMessage(body, 'AUTH_ERROR_CODE');
                if (content.success === true) {
                    logger.info('auth success', content);
                    this.options.sid = content.data.sid;
                    resolve(body, response);
                    return;
                }
                reject(content, response);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = exportModules({ auth });
