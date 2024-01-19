import { DecreaseDepth, MaxRecursionDepth } from './path'

// We need to make decrease the depth twice as fast since we index twice in PathToField
type DoubleDecrease<T extends number> = DecreaseDepth<DecreaseDepth<T>>

/**
 * Gives the path to a field in a step.
 */
export type StepPathToField = PathToField<`fields`>
export type PathToField<
    T extends string,
    D extends number = DoubleDecrease<MaxRecursionDepth>,
> = D extends never
    ? never
    : T | `${T}[${number}].subFields` | PathToField<`${T}[${number}].subFields`, DoubleDecrease<D>>
