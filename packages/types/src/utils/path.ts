/**
 * Thet literal keys and nested keys of T. Nested fields are separated by a dot (.)
 * 
 * For example, if we have an object:
 * interface MyObject {
 *     a: {
 *         b: "string"
 *         c: "another string"
 *         d: {}
 *     },
 *     e: 8
 *     f: [{ g: "hi" }]
 * }
 * 
 * Then Path<MyObject> will be:
 * "a" | "a.b" | "a.c" | "a.d" | "e" | "f"
 * 
 * Note: Paths automatically end with arrays.
 */
export type Path<T> = T extends object 
    ? { [K in keyof T]: 
          K extends string | number 
            ? T[K] extends any[] 
                ? `${K}`
                : `${K}` | (Path<T[K]> extends never ? never : `${K}.${Path<T[K]>}`) 
            : never 
      }[keyof T] 
    : never;

/** 
 * Resolves to all types of the path P in object T.
 * This is every possible value that can be stored in T
 */
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