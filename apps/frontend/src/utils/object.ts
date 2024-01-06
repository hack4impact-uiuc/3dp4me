import { Nullish } from "@3dp4me/types";

export type Path<T> = T extends object 
    ? { [K in keyof T]: K extends string | number 
        ? `${K}` | (Path<T[K]> extends never ? never : `${K}.${Path<T[K]>}`) 
        : never 
      }[keyof T] 
    : never;

// A type to extract the value type at a given path
export type PathValue<T, P = Path<T>> = 
  P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? Rest extends Path<T[K]>
        ? PathValue<T[K], Rest>
        : never
      : never
    : P extends keyof T
      ? T[P]
      : never;

/**
 * Takes an object path and returns the underlying value at that locaiton.
 * For example, obj["patient.name"] becomes obj[patient][name]
 * @param {Object} obj Object to get data from
 * @param {String} path Dot seperated path
 */
export function resolveObjPath<T extends Record<string, any>, P extends Path<T>>(obj: T, path: P): Nullish<PathValue<T, P>> {
    if (!obj) return null;

    const r = path?.split('.');
    if (r.length === 1) {
        return obj[r[0]]
    }

    return resolveObjPath(obj[r.shift()!], r.join('.'));
}

/**
 * Same as resolveObjPath except it can work with arrays in the path
 * In order to work with arrays, a condition must be provided in the brackets of array fields.
 * So if we want the 'field' with a key==='val', then the path should be "field[key==='val']"".
 * Note that this only compares the stringified value for 'key'
 */
export function resolveMixedObjPath(obj: Nullish<Record<string, any>>, path: string) {
    if (!obj) return null;
    if (!path) return obj;

    const r = path.split('.');
    const nextPath = r.shift();
    const remainingPath = r.join('.');

    // Assume the next path component is a key/value
    let nextObj = null;
    if (nextPath) nextObj = obj[nextPath];

    // If not, assume it is an array
    if (!nextObj) {
        const s = nextPath.split('[');

        // Name of the array
        const arrayName = s.shift();

        // Extract the keyname and value from the condition
        let condition = s.join('[');
        condition = condition.substr(0, condition.length - 1);
        const conditionArray = condition.split('===');
        const keyName = conditionArray[0];
        const value = conditionArray[1];

        nextObj = obj[arrayName]?.find(
            (item) => item[keyName]?.toString() === value,
        );
    }

    return resolveMixedObjPath(nextObj, remainingPath);
}
