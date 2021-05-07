const _ = require('lodash');

/**
 * Ensures that the two objects are completley equal except for the 'lastEdited' fields. For the
 * 'lastEdited' fields, we expect the second item to have a timestamp later than (or equal to) the first. This is useful
 * for comparing requests and response. I.e. we know the response should be equal to the request, but we don't know
 * when exactly the request will get executed
 * @param {Object} a The first item to compare. This should contain the lower bound on lastEdited.
 * @param {Object} b The second item to compare. This should contain the upper bound on lastEdited.
 */
module.exports.expectStrictEqualWithTimestampOrdering = (a, b) => {
    // Doing the parsing and stringifying allows us to ignore underlying types.
    // For example, normally toEqual will fail if we have a Date and String that are actually equivalent
    let aCopy = JSON.parse(JSON.stringify(a));
    let bCopy = JSON.parse(JSON.stringify(b));

    const bTimestamp = new Date(bCopy.lastEdited);
    const aTimestamp = new Date(aCopy.lastEdited);
    expect(bTimestamp.getTime()).toBeGreaterThanOrEqual(aTimestamp.getTime());

    delete aCopy.lastEdited;
    delete bCopy.lastEdited;

    expect(bCopy).toStrictEqual(aCopy);
};
