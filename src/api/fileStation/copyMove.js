/**
 * @doc https://cndl.synology.cn/download/Document/DeveloperGuide/Synology_File_Station_API_Guide.pdf#page=63&zoom=100,0,174
 */
/* eslint-disable camelcase */
const axios = require('axios');

const Wait = require('../wait-promise');


/**
 * @param {string} path - File or folder to move, use comma to separate multiple
 * @param {string} dest_folder_path - Destination path
 * @param {boolean} [overwrite] - Whether to overwrite, defaults to error on duplicate, false skips duplicates
 * @param {boolean} [remove_src=false] - Default is copy, pass true for move
 * @param {boolean} [accurate_progress=true]
 * @param {string} [search_taskid] - Used with search
 */
function start({
    path,
    dest_folder_path,
    overwrite,
    remove_src = false,
    accurate_progress = true,
    search_taskid,
}) {
    const api = 'SYNO.FileStation.CopyMove';
    const reqPath = this.COMMON_PATH;

    const queryObj = {
        api,
        method: 'start',
        version: 3,
        path,
        dest_folder_path,
        overwrite,
        remove_src,
        accurate_progress,
        search_taskid,
    };
    const url = this.stringify({ path: reqPath, params: queryObj });
    logger.info(url);
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(this.handleResponse.bind(this, resolve, reject))
            .catch(this.handleError.bind(this, reject));
    });
}

function status({ taskid }) {
    const api = 'SYNO.FileStation.CopyMove';
    const path = this.COMMON_PATH;

    const queryObj = {
        api,
        method: 'status',
        version: 3,
        taskid,
    };
    const url = this.stringify({ path, params: queryObj });
    logger.info(url);
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then((response) => {
                const content = response.data;
                const { finished } = content.data;
                if (finished) {
                    resolve(content);
                } else {
                    reject(content);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function stop({ taskid }) {
    const api = 'SYNO.FileStation.CopyMove';
    const path = this.COMMON_PATH;

    const queryObj = {
        api,
        method: 'stop',
        version: 3,
        taskid,
    };
    const url = this.stringify({ path, params: queryObj });
    logger.info(url);
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(this.handleResponse.bind(this, resolve, reject))
            .catch(this.handleError.bind(this, reject));
    });
}

/**
 * Similar to search, since it's a long-running task it has start, status to query progress, and stop to end
 */
function copyMove(params) {
    let taskId = '';
    let body = null;
    let response = null;
    return new Promise((resolve, reject) => {
        start.call(this, params)
            .then((data) => {
                const { taskid } = data.data;
                taskId = taskid;
                return Wait.until(status.bind(this, { taskid }));
            })
            .then((data, res) => {
                body = data;
                response = res;
                return stop.call(this, { taskid: taskId });
            })
            .then(() => {
                resolve(body, response);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = copyMove;
