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
    const aCopy = _.cloneDeep(a);
    const bCopy = _.cloneDeep(b);

    const bTimestamp = Date.parse(b.lastEdited);

    // expect(bTimestamp).toBeGreaterThanOrEqual(a.lastEdited);

    delete aCopy.lastEdited;
    delete bCopy.lastEdited;

    expect(aCopy).toStrictEqual(bCopy);
};
