/**
 * Convienience function for sending responses.
 * @param {Object} res The response object
 * @param {Number} code The HTTP response code to send
 * @param {String} message The message to send.
 * @param {Object} data The optional data to send back.
 */
module.exports.sendResponse = async (res, code, message, data = {}) => {
    await res.status(code).json({
        success: isCodeSuccessful(code),
        message: message,
        result: data,
    });
};

const isCodeSuccessful = (code) => {
    return 200 <= code && code < 300;
};
