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
 * @param {JSON} findParameters Parameters for db.collection.find().
 * @returns {Object} data Documents recieved from db.collection.find()
 */
// eslint-disable-next-line max-len
module.exports.getDataFromModelWithPaginationAndSearch = async (req, model, findParameters = {}) => {
    // The default values below will get the first user in the database
    const {
        pageNumber = 1, nPerPage = DEFAULT_PATIENTS_ON_GET_REQUEST, searchBy = '',
    } = req.query;
    const intPageNumber = parseInt(pageNumber, 10);
    const intPatientsPerPage = parseInt(nPerPage, 10);
    const lowerCaseSearchBy = searchBy.toLowerCase();

    const data = await model.find(findParameters).sort({ lastEdited: -1 });

    /* Filter by search */

    let filteredData = [];

    if (lowerCaseSearchBy !== '') {
        /* The following fields below will be considered during the search.
           All of the fields are encrypted in the database.
           If the data associated with any one of these fields
           contains lowerCaseSearchBy, we will return it. */
        const fieldsToCheck = ['firstName', 'fathersName', 'grandfathersName', 'familyName', 'phoneNumber'];

        for (let dataIdx = 0; dataIdx < data.length; dataIdx++) {
            for (let fieldsIdx = 0; fieldsIdx < fieldsToCheck.length; fieldsIdx++) {
                const patientField = data[dataIdx][fieldsToCheck[fieldsIdx]] || '';
                if (patientField.toLowerCase().includes(lowerCaseSearchBy)) {
                    filteredData.push(data[dataIdx]);
                    break;
                }
            }
        }
    } else {
        // No filtering is needed
        filteredData = data;
    }

    /* Filter by page number */

    const countTotalPatients = filteredData.length;
    const documentsToSkip = intPageNumber > 0 ? ((intPageNumber - 1) * intPatientsPerPage) : 0;

    const paginatedData = filteredData.splice(documentsToSkip, intPatientsPerPage);

    return ({
        data: paginatedData,
        count: countTotalPatients,
    });
};

const isCodeSuccessful = (code) => code >= 200 && code < 300;
