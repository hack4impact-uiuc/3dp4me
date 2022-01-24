export const DIRECTION = {
    UP: -1,
    DOWN: 1,
};

// Inclusive min and exclusive max
export const checkBounds = (min, max, num) => {
    return num >= min && num < max;
};

// Returns a non-deleted element before or after a given element based on index
export const getValidAdjacentElement = (arr, currIndex, direction) => {
    let prevNextIndex = currIndex + direction;

    while (
        checkBounds(0, arr.length, prevNextIndex) &&
        arr[prevNextIndex].isDeleted
    ) {
        prevNextIndex += direction;
    }

    if (prevNextIndex < 0 || prevNextIndex >= arr.length) {
        return -1;
    }

    return prevNextIndex;
};

// Swaps the value of two elements in an array given their indices and attribute key
export const swapValuesInArrayByKey = (arr, key, firstIndex, secondIndex) => {
    const temp = arr[firstIndex][key];
    // eslint-disable-next-line no-param-reassign
    arr[firstIndex][key] = arr[secondIndex][key];
    // eslint-disable-next-line no-param-reassign
    arr[secondIndex][key] = temp;
};
