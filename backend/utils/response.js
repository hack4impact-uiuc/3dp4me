const {
    DEFAULT_PATIENTS_ON_GET_REQUEST,
} = require('./constants');

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
        message,
        result: data,
    });
};

/**
 * Convienience function getting data from a model with pagination
 * @param {Obect} req The request object
 * @param {MongoDB Collection} model The mongoDB model
 * @param {JSON} findParameters Parameters for db.collection.find()
 * @returns {Object} data Documents recieved from db.collection.find()
 */
module.exports.getDataFromModelWithPagination = async (req, model, findParameters = {}) => {
    // The default values below will get the first user in the database
    let { pageNumber = 1, nPerPage = DEFAULT_PATIENTS_ON_GET_REQUEST } = req.query;
    pageNumber = parseInt(pageNumber, 10);
    nPerPage = parseInt(nPerPage, 10);

    const documentsToSkip = pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0;

    const data = await model.find(findParameters)
        .sort({ lastEdited: -1 }).skip(documentsToSkip)
        .limit(nPerPage);

    return data;
};

const isCodeSuccessful = (code) => code >= 200 && code < 300;
