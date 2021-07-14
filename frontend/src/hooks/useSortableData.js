import React from 'react';

import { resolveObjPath } from '../utils/object';

const useSortableData = (items, UNSORTED_DATA, config = null) => {
    const [sortConfig, setSortConfig] = React.useState(config);

    const compare = (a, b, key) => {
        const aVal = resolveObjPath(a, key);
        const bVal = resolveObjPath(b, key);

        if (!aVal && !bVal) return 0;

        if (!aVal && bVal) return -1;

        if (aVal && !bVal) return 1;

        if (aVal > bVal) return -1;

        if (aVal < bVal) return 1;

        return 0;
    };

    const sortedItems = React.useMemo(() => {
        const sortableItems = [...items];
        if (sortConfig !== null) {
            if (sortConfig.direction === 'none') return UNSORTED_DATA;

            sortableItems.sort((a, b) => {
                const res = compare(a, b, sortConfig.key);
                return sortConfig.direction === 'ascending' ? res : res * -1;
            });
        }
        return sortableItems;
    }, [items, sortConfig, compare, UNSORTED_DATA]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        } else if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'descending'
        ) {
            direction = 'none';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

export default useSortableData;
