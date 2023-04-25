export const range = (start: number, end?: number): number[] => {
    if (end === undefined) {
        return rangeOneArg(start)
    }
    return rangeTwoArgs(start, end)
}

const rangeOneArg = (end: number): number[] => {
    return [...new Array(end).keys()]
}

const rangeTwoArgs = (start: number, end: number): number[] => {
    return [...range(end - start).map((v) => v + 1)]
}
