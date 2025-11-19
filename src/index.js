/**
 * @file synology api
 * @author ltaoo<litaowork@aliyun.com>
 */
const qs = require('qs');

const Auth = require('./api/auth');
const FileStation = require('./api/fileStation');
const { appendErrorMessage } = require('./utils');

class Synology {
    constructor(options) {
        this.options = options;

        this.COMMON_PATH = '/entry.cgi';
        this.Auth = Auth(this);
        this.FileStation = FileStation(this);
    }

    /**
     * Override existing options with new ones
     * @param {Object} options
     */
    update(options) {
        this.options = {
            ...this.options,
            ...options,
        };
    }

    /**
     * Build the request URL
     * @param {string} path - API endpoint path
     * @param {Object} params - Query parameters
     * @return {URL}
     */
    stringify({ path, params }) {
        const {
            protocol = 'http', host, port = '5000', sid,
        } = this.options;
        const queryObj = params;
        if (queryObj.api !== 'SYNO.API.Auth') {
            /* eslint-disable no-underscore-dangle */
            queryObj._sid = sid;
        }
        const query = qs.stringify(queryObj);
        const search = `?${query}`;
        return `${protocol}://${host}:${port}/webapi${path}${search}`;
    }

    /* eslint-disable class-methods-use-this */
    /**
     * Common response handler (axios version)
     * @param {Object} response - axios response object
     * @param {Object} response.data - response body
     */
    handleResponse(resolve, reject, response) {
        const body = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        const content = appendErrorMessage(body);
        logger.info('request success', content);
        resolve(content, response);
    }

    /**
     * Common error handler (axios version)
     * @param {Error} err - axios error object
     */
    handleError(reject, err) {
        logger.error(err);
        reject(err);
    }
}

module.exports = Synology;
