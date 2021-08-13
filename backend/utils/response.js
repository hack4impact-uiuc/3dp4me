const HTTP_OK = 200;

/**
 * Convienience function for sending responses.
 * @param {Object} res The response object
 * @param {Number} code The HTTP response code to send
 * @param {String} message The message to send.
 * @param {Object} data The optional data to send back.
 */
module.exports.sendResponse = (res, code, message, data = {}) => {
    res.status(code).json({
        success: code === HTTP_OK,
        message: message,
        result: data,
    });
};
