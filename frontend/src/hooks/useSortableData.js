import React, { useState, useMemo } from 'react';
import _ from 'lodash';
import { SORT_DIRECTIONS } from '../utils/constants';
import { resolveObjPath } from '../utils/object';

const useSortableData = (data) => {
    const [sortConfig, setSortConfig] = useState(null);
    const sortableData = useMemo(() => _.cloneDeep(data), [data]);
    const sortedData = useMemo(() => {
        /**
         * Compares the two objects with comparison operator. A
         * non-null object is always treated as greater than null
         */
        const compare = (a, b, key) => {
            console.log(key);
            const aVal = resolveObjPath(a, key);
            const bVal = resolveObjPath(b, key);
            if ((!aVal && bVal) || aVal > bVal) return -1;
            if ((aVal && !bVal) || aVal < bVal) return 1;

            return 0;
        };

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
    }, [data, sortConfig]);

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
        sortedData: sortedData,
        requestSort: requestSort,
        sortConfig: sortConfig,
    };
};

export default useSortableData;
