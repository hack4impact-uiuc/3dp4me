import { DecreaseDepth } from "./path"

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