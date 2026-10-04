import { isServerSortablePatientField, Nullish, Path, Patient } from '@3dp4me/types'
import { useState } from 'react'

import { SortDirection } from '../utils/constants'
import { ControlledSort, getNextSortConfig, SortConfig } from './useSortableData'

const getServerSortParams = (config: Nullish<SortConfig<Patient>>) => {
    if (!config || config.direction === SortDirection.None) return {}
    if (!isServerSortablePatientField(config.key)) return {}

    return {
        sortBy: config.key,
        sortOrder: config.direction === SortDirection.Ascending ? 'asc' : 'desc',
    } as const
}

/**
 * Sort state for paginated patient tables. Top-level patient fields are sorted
 * across all patients by the server; other columns only sort the current page.
 * @param onServerSortChanged Called when the server sort changes, e.g. to go back to page 1
 */
export const usePatientSort = (onServerSortChanged: () => void) => {
    const [config, setConfig] = useState<Nullish<SortConfig<Patient>>>(null)
    const { sortBy, sortOrder } = getServerSortParams(config)

    const requestSort = (key: Path<Patient>) => {
        const nextConfig = getNextSortConfig(config, key)
        const next = getServerSortParams(nextConfig)
        if (next.sortBy !== sortBy || next.sortOrder !== sortOrder) onServerSortChanged()

        setConfig(nextConfig)
    }

    const sort: ControlledSort<Patient> = {
        config,
        requestSort,
        isSortedExternally: isServerSortablePatientField,
    }

    return {
        sort,
        sortBy,
        sortOrder,
        resetSort: () => setConfig(null),
    }
}
