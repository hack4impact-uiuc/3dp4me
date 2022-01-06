const _ = require('lodash');

/**
 * Removes attributes from a request's body. So if "_id" is passed in, "_id" will be removed
 * from the request if it exists.
 * @param {Array} attributes String array of attribute keys to remove
 */
module.exports.removeRequestAttributes = (attributes) => (req, res, next) => {
    req.body = this.removeAttributesFrom(req.body, attributes);
    next();
};

/**
 * Recursively updates the value paired with all specified keys in an object,
 * regardless of its depth in the object.
 * @param {Object} object JSON object to update
 * @param {String} keyToUpdate The key whose value or values needs to be overriden
 * @param {Any} value The new value
 */
const updateAllKeysInObject = (object, keyToUpdate, value) => {
    if (!object) return;

    Object.keys(object).forEach((key) => {
        if (key === keyToUpdate) {
            // eslint-disable-next-line no-param-reassign
            object[keyToUpdate] = value;
        } else if (typeof object[key] === 'object') {
            updateAllKeysInObject(object[key], keyToUpdate, value);
        }
    });
};

/**
 * Updates the lastEdited and lastEditedBy fields of a request's body.
 * So, if the request body is set to a stepBody, then this function
 * can be used to update the lastEdited of a MULTILINE_STRING field
 * and other fields that contain a lastEdited attribute.
 */
module.exports.addLastEditedToStepFields = () => (req, res, next) => {
    updateAllKeysInObject(req.body, 'lastEdited', Date.now());
    updateAllKeysInObject(req.body, 'lastEditedBy', req.user.name);
    next();
};

/**
 * Removes a list of attributes from an object
 * @param {Object} obj To remove attributes from
 * @param {Array} attributes String array of attributes to remove
 * @returns
 */
module.exports.removeAttributesFrom = (obj, attributes) => _.omit(obj, attributes);
