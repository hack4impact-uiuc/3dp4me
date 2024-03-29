export enum Direction {
    UP = -1,
    DOWN = 1,
}

interface Deletable {
    isDeleted: boolean
}

// Inclusive min and exclusive max
const checkBounds = (min: number, max: number, num: number) => num >= min && num < max

// Returns a non-deleted element before or after a given element based on index
export const getValidAdjacentElement = <T extends Deletable>(
    arr: T[],
    currIndex: number,
    direction: Direction
): number => {
    let prevNextIndex = currIndex + direction

    while (checkBounds(0, arr.length, prevNextIndex) && arr[prevNextIndex].isDeleted) {
        prevNextIndex += direction
    }

    if (prevNextIndex < 0 || prevNextIndex >= arr.length) {
        return -1
    }

    return prevNextIndex
}

type ArrayAtPath<T extends any[], P extends string> = T extends Array<infer U>
    ? P extends keyof U
        ? T
        : never
    : never

// Swaps the value of two elements in an array given their indices and attribute key
export const swapValuesInArrayByKey = <T extends any[], P extends string>(
    arr: ArrayAtPath<T, P>,
    key: P,
    firstIndex: number,
    secondIndex: number
) => {
    const temp = arr[firstIndex][key]
    // eslint-disable-next-line no-param-reassign
    arr[firstIndex][key] = arr[secondIndex][key]
    // eslint-disable-next-line no-param-reassign
    arr[secondIndex][key] = temp
}
