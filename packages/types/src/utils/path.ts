/* eslint-disable @typescript-eslint/no-explicit-any */
export type MaxRecursionDepth = 12

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
 * "a" | "a.b" | "a.c" | "a.d" | "e" | "f" | "f[number]" | "f[number].g"
 *
 * We have to limit the depth of the recursion to a reasonable amount, so we use the DecreaseDepth type
 */
export type Path<T, D extends number = MaxRecursionDepth> = D extends never
    ? never
    : T extends (infer A)[]
    ? `[${number}]` | `[${number}]${WithSeparator<A, Path<A, DecreaseDepth<D>>>}`
    : T extends object
    ? {
          [K in keyof T]: K extends string | number
              ? `${K}` | `${K}${WithSeparator<T[K], Path<T[K], DecreaseDepth<D>>>}`
              : never
      }[keyof T]
    : never

type WithSeparator<T, P extends string> = T extends any[] ? P : `.${P}`

/**
 * Resolves to all types of the path P in object T.
 * This is every possible value that can be stored in T
 */
export type PathValue<T, P = Path<T>> = P extends keyof T
    ? T[P]
    : P extends `${infer K}.${infer Rest}`
    ? PathValue<PathValue<T, K>, Rest>
    : P extends `${infer K}[${number}]`
    ? K extends keyof T
        ? T[K] extends (infer A)[]
            ? A
            : never
        : never
    : P extends `${infer K}[${number}].${infer Rest}`
    ? K extends keyof T
        ? T[K] extends (infer A)[]
            ? PathValue<A, Rest>
            : never
        : never
    : never

/**
 * This is just a helper type. In the below types, it's impossible to specify all paths for a recursive
 * object. So this just acts as a recursion counter for us to limit the depth to a reasonable amount
 */
export type DecreaseDepth<T extends number> = T extends 1
    ? never
    : T extends 2
    ? 1
    : T extends 3
    ? 2
    : T extends 4
    ? 3
    : T extends 5
    ? 4
    : T extends 6
    ? 5
    : T extends 7
    ? 6
    : T extends 8
    ? 7
    : T extends 9
    ? 8
    : T extends 10
    ? 9
    : T extends 11
    ? 10
    : T extends 12
    ? 11
    : never
