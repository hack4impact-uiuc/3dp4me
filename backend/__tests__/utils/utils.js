const _ = require('lodash');

/**
 * Checks if the given object is completley contained in the parent object.
 * For example { "A": 1, "B": 3 } is contained in { "A": 1, "C": 10, "B": 3} but
 * not in {"A": 10}
 * @param {Object} object The object to check
 * @param {Object} subObject The sub object to check
 * @returns
 */
module.exports.isSubObject = (object, subObject) => {
    for (const key of Object.keys(subObject)) {
        if (!_.isEqual(object[key], subObject[key]))
            throw `Super object.${key} has value of ${object[key]}. Expected ${subObject[key]}`;
    }

    return true;
};
