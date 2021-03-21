/**
 * Takes an object path and returns the underlying value at that locaiton.
 * For example, obj["patient.name"] becomes obj[patient][name]
 * @param {Object} obj Object to get data from
 * @param {String} path Dot seperated path
 */
export function resolveObjPath(obj, path) {
    if (obj == null) return null;

    const r = path.split('.');
    if (path) return resolveObjPath(obj[r.shift()], r.join('.'));

    return obj;
}
