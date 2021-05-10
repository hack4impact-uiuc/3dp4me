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

/**
 * Checks if two objects are disjoint. Two objects are disjoint if for the same key, they never contain the same value.
 * { a: 1, b: 2 } and { a: 5, c: 4 } are disjoint. { a: 1, b: 2 } and { a: 3, b: 2 } are not disjoint since b is 2 in both.
 * @param {Object} a The first object to check
 * @param {Object} b The second object to check
 * @returns True if a and b are disjoint, false otherwise
 */
module.exports.areObjectsDisjoint = (a, b) => {
    for (let k of Object.keys(a)) {
        if (b[k] && a[k] == b[k]) return false;
    }

    return true;
};
