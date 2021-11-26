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
 * Removes patients whose name, phone nunber, or unique _id contains the searchQuery
 * @param {List} patients A list of patients
 * @param {String} searchQuery A word or phrase related to a specific patient/group of patients
 * @returns a List containing the filtering patients
 */
const filterPatientsBySearchQuery = (patients, searchQuery) => {
    if (searchQuery === '') {
        return patients;
    }

    const filteredData = [];

    if (searchQuery !== '') {
        /* The following fields below will be considered during the search.
           All of the fields are encrypted in the database.
           If the data associated with any one of these fields
           contains the search query, we will return it. */
        const fieldsToCheckList = ['_id', 'firstName', 'fathersName', 'grandfathersName', 'familyName', 'phoneNumber'];

        for (let dataIdx = 0; dataIdx < patients.length; dataIdx++) {
            for (let fieldsIdx = 0; fieldsIdx < fieldsToCheckList.length; fieldsIdx++) {
                const fieldToCheck = fieldsToCheckList[fieldsIdx];
                const patientDataByField = patients[dataIdx][fieldToCheck] || '';
                if (patientDataByField.toString().toLowerCase().includes(searchQuery)) {
                    filteredData.push(patients[dataIdx]);
                    break;
                }
            }
        }
    }
    return filteredData;
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
        pageNumber = 1, nPerPage = DEFAULT_PATIENTS_ON_GET_REQUEST, searchQuery = '',
    } = req.query;
    const intPageNumber = parseInt(pageNumber, 10);
    const intPatientsPerPage = parseInt(nPerPage, 10);
    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    // Calculates the number of patients to skip based on the request paramaters
    const documentsToSkip = intPageNumber > 0 ? ((intPageNumber - 1) * intPatientsPerPage) : 0;

    // Perform pagination while doing .find() if there isn't a search query
    if (lowerCaseSearchQuery === '') {
        const patientCount = await model.count(findParameters);
        const data = await model.find(findParameters)
            .sort({ lastEdited: -1 }).skip(documentsToSkip)
            .limit(intPatientsPerPage);

        return ({
            data,
            count: patientCount,
        });
    }

    const data = await model.find(findParameters).sort({ lastEdited: -1 });

    // Filter by search
    const filteredData = filterPatientsBySearchQuery(data, lowerCaseSearchQuery);

    // Filter by page number
    const countTotalPatients = filteredData.length;

    const paginatedData = filteredData.splice(documentsToSkip, intPatientsPerPage);

    return ({
        data: paginatedData,
        count: countTotalPatients,
    });
};

const isCodeSuccessful = (code) => code >= 200 && code < 300;
