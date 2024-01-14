import { Field, Step } from "src/models";
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
export type Path<T, D extends number = 6> = 
D extends never ?
  never
: T extends object 
    ? { [K in keyof T]: 
          K extends string | number 
            ? T[K] extends (infer A)[] 
                ? K | `${K}[${number}]` | `${K}[${number}].${Path<A, DecreaseDepth<D>>}`
                : `${K}` | (Path<T[K], DecreaseDepth<D>> extends never ? never : `${K}.${Path<T[K], DecreaseDepth<D>>}`) 
            : never 
      }[keyof T] 
    : never;

    /** 
 * Resolves to all types of the path P in object T.
 * This is every possible value that can be stored in T
 */
// export type PathValue<T, P = Path<T>> = 
//   P extends keyof T
//     ? T[P]
//   : P extends `${infer K}.${infer Rest}`
//     ? K extends keyof T
//       ? Rest extends Path<T[K]>
//         ? PathValue<T[K], Rest>
//         : never
//       : `never2 ${K}`
//     : P extends `${infer K}[${number}]`
//       ? K extends keyof T
//         ? T[K] extends (infer A)[]
//           ? A
//           : never
//       : never
//     : P extends `${infer K}[${number}].${infer Rest}`
//       ? K extends keyof T
//         ? T[K] extends (infer A)[]
//           ? PathValue<A, Rest>
//           : never
//       : never
//     : never

export type PathValue<T, P = Path<T>> = 
  P extends keyof T
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



// ---------------------------- EVERNTHING UNDER HERE EXPERIMENTAL ----------------------------


/**
 * Gives the path to a field in a step.
 */
export type StepPathToField = PathToField<`fields`>
export type PathToField<T extends string, D extends number = 5> = 
    D extends never ?
      never
    : T | 
    `${T}[${number}].subFields` 
    | PathToField<`${T}[${number}].subFields`, DecreaseDepth<D>>

    type test = StepPathToField extends Path<Step> ? true : false
    type test2 = `fields[0].subFields[0].subFields[0].subFields[0].subFields[0].subFields` extends Path<Step> ? true : false

// /**
//  * This is just a helper type. In the below types, it's impossible to specify all paths for a recursive 
//  * object. So this just acts as a recursion counter for us to limit the depth to a reasonable amount
//  */
export type DecreaseDepth<T extends number> = 
    T extends 1 ? never : T extends 2 ? 1 : T extends 3 ? 2 : T extends 4 ? 3 : T extends 5 ? 4 : T extends 6 ? 5 : never;

// /**
//  * Thet literal keys and nested keys of T. Nested fields are separated by a dot (.)
//  * 
//  * For example, if we have an object:
//  * interface MyObject {
//  *     a: {
//  *         b: "string"
//  *         c: "another string"
//  *         d: {}
//  *     },
//  *     e: 8
//  *     f: [{ g: "hi" }]
//  * }
//  * 
//  * Then Path<MyObject> will be:
//  * "a" | "a.b" | "a.c" | "a.d" | "e" | "f"
//  */
// export type Path<T, D extends number = 5> = [D] extends [never] ? never : T extends object
//     ? { [K in keyof T]: 
//         K extends string | number
//         ? T[K] extends any[] 
//             ? `${K}` | `${K}.[${string}].${Path<T[K][number], DecreaseDepth<D>>}`
//             : `${K}` | (Path<T[K], DecreaseDepth<D>> extends never ? never : `${K}.${Path<T[K], DecreaseDepth<D>>}`) 
//         : never 
//     }[keyof T] 
//     : never;

// /**
//  * Same as Path<T>, but stops at arrays and doesn't work with recursive objects
//  */
// export type PathNoRecOrArrays<T> = T extends object 
//     ? { [K in keyof T]: 
//           K extends string | number 
//             ? T[K] extends any[] 
//                 ? `${K}`
//                 : `${K}` | (PathNoRecOrArrays<T[K]> extends never ? never : `${K}.${PathNoRecOrArrays<T[K]>}`) 
//             : never 
//       }[keyof T] 
//     : never;

//     interface Test {
//       a: "a"
//       b: string
//       d: {
//         f: number
//         e: number[][]
//       }
//     }

//   type a = Path<Test>

// /** 
//  * Resolves to all types of the path P in object T.
//  * This is every possible value that can be stored in T
//  */
// export type PathValue<T, P = PathNoRecOrArrays<T>> = 
//   P extends `${infer K}.${infer Rest}`
//     ? K extends keyof T
//       ? Rest extends PathNoRecOrArrays<T[K]>
//         ? PathValue<T[K], Rest>
//         : never
//       : never
//     : P extends keyof T
//       ? T[P]
//       : never;