import _ from 'lodash';
import { useState, useMemo } from 'react';

import { SORT_DIRECTIONS } from '../utils/constants';
import { resolveObjPath } from '../utils/object';

/**
 * Hook that takes in an array of data and sorts it when requested
 * @param {Array} data The data to sort
 * @returns Three items: `sortedData` is the data after sorting. `requestSort` is a function
 *          that causes a resort when called, and `sortConfig` tells about the current sort config
 */
const useSortableData = (data) => {
    const [sortConfig, setSortConfig] = useState(null);
    const sortableData = useMemo(() => _.cloneDeep(data), [data]);
    const sortedData = useMemo(() => {
        /**
         * Compares the two objects with comparison operator. A
         * non-null object is always treated as greater than null
         */
        const compare = (a, b, key) => {
            const aVal = resolveObjPath(a, key);
            const bVal = resolveObjPath(b, key);
            if ((!aVal && bVal) || aVal > bVal) return -1;
            if ((aVal && !bVal) || aVal < bVal) return 1;

            return 0;
        };

        // Do the actual sorting if requested
        if (sortConfig !== null) {
            if (sortConfig.direction === SORT_DIRECTIONS.NONE) return data;

            sortableData.sort((a, b) => {
                const res = compare(a, b, sortConfig.key);
                return sortConfig.direction === SORT_DIRECTIONS.AESC
                    ? res
                    : res * -1;
            });
        }

        return sortableData;
    }, [data, sortableData, sortConfig]);

    /**
     * Circularly toggles from up to down to none
     */
    const requestSort = (key) => {
        let direction = SORT_DIRECTIONS.AESC;

        if (
            sortConfig?.key === key &&
            sortConfig?.direction === SORT_DIRECTIONS.AESC
        )
            direction = SORT_DIRECTIONS.DESC;
        else if (
            sortConfig?.key === key &&
            sortConfig?.direction === SORT_DIRECTIONS.DESC
        )
            direction = SORT_DIRECTIONS.NONE;

        setSortConfig({ key, direction });
    };

    return {
        sortedData,
        requestSort,
        sortConfig,
    };
};

export default useSortableData;
