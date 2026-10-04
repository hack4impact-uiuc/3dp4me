import { Nullish, Path } from '@3dp4me/types'
import cloneDeep from 'lodash/cloneDeep'
import { useMemo, useState } from 'react'

import { SortDirection } from '../utils/constants'
import { resolveObjPath } from '../utils/object'

export interface SortConfig<T> {
    key: Path<T>
    direction: SortDirection
}

// Sort state owned by a parent, e.g. when some keys are sorted server-side
export interface ControlledSort<T> {
    config: Nullish<SortConfig<T>>
    requestSort: (key: Path<T>) => void
    // Keys the data already arrives sorted by, so they aren't re-sorted locally
    isSortedExternally: (key: Path<T>) => boolean
}

/**
 * Compares the two objects with comparison operator. A
 * non-null object is always treated as greater than null
 */
const compare = <T extends Record<string, any>>(a: T, b: T, key: Path<T>) => {
    const aVal = resolveObjPath(a, key)
    const bVal = resolveObjPath(b, key)
    if (!aVal && bVal) return -1
    if (aVal && !bVal) return 1
    if (!aVal && !bVal) return 0

    if (aVal! > bVal!) return 1
    if (aVal! < bVal!) return -1

    return 0
}

/**
 * Returns a sorted copy of data according to sortConfig
 */
export const sortData = <T extends Record<string, any>>(
    data: Nullish<T[]>,
    sortConfig: Nullish<SortConfig<T>>
) => {
    if (!data || !sortConfig || sortConfig.direction === SortDirection.None) return data

    return cloneDeep(data).sort((a, b) => {
        const res = compare(a, b, sortConfig.key)
        return sortConfig.direction === SortDirection.Ascending ? res : res * -1
    })
}

/**
 * Circularly toggles from up to down to none
 */
export const getNextSortConfig = <T>(
    sortConfig: Nullish<SortConfig<T>>,
    key: Path<T>
): SortConfig<T> => {
    let direction = SortDirection.Ascending

    if (sortConfig?.key === key && sortConfig?.direction === SortDirection.Ascending)
        direction = SortDirection.Descending
    else if (sortConfig?.key === key && sortConfig?.direction === SortDirection.Descending)
        direction = SortDirection.None

    return { key, direction }
}

/**
 * Hook that takes in an array of data and sorts it when requested
 * @param {Array} data The data to sort
 * @returns Three items: `sortedData` is the data after sorting. `requestSort` is a function
 *          that causes a resort when called, and `sortConfig` tells about the current sort config
 */
const useSortableData = <T extends Record<string, any>>(data: Nullish<T[]>) => {
    const [sortConfig, setSortConfig] = useState<Nullish<SortConfig<T>>>(null)
    const sortedData = useMemo(() => sortData(data, sortConfig), [data, sortConfig])

    const requestSort = (key: Path<T>) => setSortConfig(getNextSortConfig(sortConfig, key))

    return {
        sortedData,
        requestSort,
        sortConfig,
    }
}

export default useSortableData
