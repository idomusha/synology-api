/**
 * @doc https://cndl.synology.cn/download/Document/DeveloperGuide/Synology_File_Station_API_Guide.pdf#page=63&zoom=100,0,174
 */
const axios = require('axios');

/**
 * Search files according to given criteria.
 * @example ?api=SYNO.FileStation.Search&version=2&method=start&folder_path=%22%2Fvideo%22&pattern=1
 * @param {string} folder_path
 * @param {boolean} [recursive=true] - Whether to search recursively
 * @param {string} [search_type=simple] - Not in docs, but used in actual requests
 * @param {boolean} [search_content=false] - Not in docs, but used in actual requests
 * @param {pattern} [pattern]
 * @param {pattern} [extension]
 * @param {string} [fileType=all] file|dir|all
 * @param {number} [size_from] - byte size
 * @param {number} [size_to] - byte size
 * @param {timestamp} [mtime_from]
 * @param {timestamp} [mtime_to]
 * @param {timestamp} [crtime_from]
 * @param {timestamp} [crtime_to]
 * @param {timestamp} [atime_form]
 * @param {timestamp} [atime_to]
 * @param {string} [owner]
 * @param {string} [group]
 */
function start(params) {
    const api = 'SYNO.FileStation.Search';
    const path = this.COMMON_PATH;

    const queryObj = {
        api,
        method: 'start',
        version: 2,
        ...params,
    };
    const url = this.stringify({ path, params: queryObj });

    logger.info('start search', url);
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(this.handleResponse.bind(this, resolve, reject))
            .catch(this.handleError.bind(this, reject));
    });
}

/**
 * List matched files in a search temporary database.
 * @param {string} taskid - the response of start request
 * @param {number} [offset=0]
 * @param {number} [limit=0]
 * @param {string} [sort_by=name] - name|user|group|mtime|atime|ctime|crtime|posix
 * @param {string} [sort_direction=asc] asc|desc
 * @param {pattern} [pattern] - Actually start accepts this param, so it's not needed here
 * @param {string} [fileType=all] file|dir|all
 * @param {string} [additional=undefined]
 * real_path,owner,time,perm,mount_point_type,sync_share,volume_status
 * Additional info to include in results, e.g. real_path for absolute path
 * @return {Promise}
 */
function list(params) {
    const api = 'SYNO.FileStation.Search';
    const path = this.COMMON_PATH;

    const queryObj = {
        api,
        method: 'list',
        version: 2,
        ...params,
    };
    const url = this.stringify({ path, params: queryObj });
    logger.info('list search', url);
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(this.handleResponse.bind(this, resolve, reject))
            .catch(this.handleError.bind(this, reject));
    });
}

/**
 * Stop the searching task(s).
 * @param {*} params
 * @param {string} taskid
 */
function stop(params) {
    const api = 'SYNO.FileStation.Search';
    const path = this.COMMON_PATH;

    const queryObj = {
        api,
        method: 'stop',
        version: 2,
        ...params,
    };
    const url = this.stringify({ path, params: queryObj });

    logger.info('stop search', url);
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(this.handleResponse.bind(this, resolve, reject))
            .catch(this.handleError.bind(this, reject));
    });
}

/**
 * Delete search temporary database(s)
 * @param {*} params
 * @param {string} taskid
 */
function clean(params) {
    const api = 'SYNO.FileStation.Search';
    const path = this.COMMON_PATH;

    const queryObj = {
        api,
        method: 'clean',
        version: 2,
        ...params,
    };
    const url = this.stringify({ path, params: queryObj });

    logger.info('clean search', url);
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(this.handleResponse.bind(this, resolve, reject))
            .catch(this.handleError.bind(this, reject));
    });
}

/**
 * Search is a special API, consisting of four endpoints: start, list, stop, and clean.
 * After starting a search with start, list must be called multiple times to get all results.
 * After confirming search is complete, call stop and clean.
 * If we only expose search to users and handle multiple list calls internally, wait time could be long.
 * It's better to let users call list multiple times, but this requires them to call stop manually.
 * @TODO Currently only returns partial results
 * @param {string} folder_path - Directory to search
 * @param {string} pattern - Filename pattern to search
 * @param {number} limit - Number of results
 * @param {string} [additional] - Additional info to include
 */
function search({
    /* eslint-disable camelcase */
    folder_path,
    pattern,
    offset = 0,
    limit = 10,
    search_type = 'simple',
    search_content = false,
    recursive = true,
    additional,
    fileType = 'all',
}) {
    return new Promise((resolve, reject) => {
        let taskId = null;
        const instance = this;
        const startParams = {
            folder_path,
            pattern,
            search_type,
            search_content,
            recursive,
        };
        start.call(instance, startParams)
            .then(({ data }) => {
                const { taskid } = data;
                taskId = taskid;
                const listParams = {
                    taskid,
                    offset,
                    limit,
                    additional,
                    // Docs say fileType, but actual request uses filetype
                    filetype: fileType,
                };
                return list.call(instance, listParams);
            })
            .then((body) => {
                resolve(body);
                stop.call(instance, { taskid: taskId });
            })
            .then(() => clean.call(instance, { taskid: taskId }))
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = search;
