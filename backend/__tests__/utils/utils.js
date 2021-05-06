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

/**
 * Ensures that the two objects are completley equal except for the 'lastEdited' fields. For the
 * 'lastEdited' fields, we expect the second item to have a timestamp later than (or equal to) the first. This is useful
 * for comparing requests and response. I.e. we know the response should be equal to the request, but we don't know
 * when exactly the request will get executed
 * @param {Object} a The first item to compare. This should contain the lower bound on lastEdited.
 * @param {Object} b The second item to compare. This should contain the upper bound on lastEdited.
 */
module.exports.expectStrictEqualWithTimestampOrdering = (a, b) => {
    const aCopy = _.cloneDeep(a);
    const bCopy = _.cloneDeep(b);

    expect(b.lastEdited).toBeGreaterThanOrEqual(a.lastEdited);

    delete aCopy.lastEdited;
    delete bCopy.lastEdited;

    expect(aCopy).toStrictEqual(bCopy);
};
