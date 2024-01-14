import _ from 'lodash';
import { useState, useMemo } from 'react';

import { SortDirection } from '../utils/constants';
import { resolveObjPath } from '../utils/object';
import { Nullish, Path, Patient } from '@3dp4me/types';

export interface SortConfig<T> {
    key: Path<T>,
    direction: SortDirection
}

/**
 * Hook that takes in an array of data and sorts it when requested
 * @param {Array} data The data to sort
 * @returns Three items: `sortedData` is the data after sorting. `requestSort` is a function
 *          that causes a resort when called, and `sortConfig` tells about the current sort config
 */
const useSortableData = <T extends Record<string, any>>(data: T[]) => {
    const [sortConfig, setSortConfig] = useState<Nullish<SortConfig<T>>>(null);
    const sortableData = useMemo(() => _.cloneDeep(data), [data]);
    const sortedData = useMemo(() => {
        /**
         * Compares the two objects with comparison operator. A
         * non-null object is always treated as greater than null
         */
        const compare = (a: T, b: T, key: Path<T>) => {
            const aVal = resolveObjPath(a, key);
            const bVal = resolveObjPath(b, key);
            if (!aVal && bVal) return -1
            if (aVal && !bVal) return 1;
            if (!aVal && !bVal) return 0;
            

            if (aVal! > bVal!) return -1;
            if (aVal! < bVal!) return 1;

            return 0;
        };

        // Do the actual sorting if requested
        if (!!sortConfig) {
            if (sortConfig.direction === SortDirection.None) return data;

            sortableData.sort((a, b) => {
                const res = compare(a, b, sortConfig.key);
                return sortConfig.direction === SortDirection.Ascending
                    ? res
                    : res * -1;
            });
        }

        return sortableData;
    }, [data, sortableData, sortConfig]);

    /**
     * Circularly toggles from up to down to none
     */
    const requestSort = (key: Path<T>) => {
        let direction = SortDirection.Ascending;

        if (
            sortConfig?.key === key &&
            sortConfig?.direction === SortDirection.Ascending
        )
            direction = SortDirection.Descending;
        else if (
            sortConfig?.key === key &&
            sortConfig?.direction === SortDirection.Descending
        )
            direction = SortDirection.None;

        setSortConfig({ key, direction });
    };

    return {
        sortedData,
        requestSort,
        sortConfig,
    };
};

export default useSortableData;
