import {range} from "../utils/range";

export type DaysForMonthType = {
    day: number
    monthOffset: -1 | 0 | 1 | number
}

export const computeDaysForMonth = (currentMonthDate: Date): DaysForMonthType[] => {
    const nextMonthDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)

    const firstDayCurrent = getFirstDayOfMonthStartingMonday(currentMonthDate)
    const lastDayNumberCurrent = getLastDayOfMonth(currentMonthDate)
    const lastDayNext = getFirstDayOfMonthStartingMonday(nextMonthDate)

    return [
        ...range(firstDayCurrent).map((v) => ({ day: v + 20, monthOffset: -1 })),
        ...range(1, lastDayNumberCurrent + 1).map((v) => ({ day: v, monthOffset: 0 })),
        ...range(1, 8 - lastDayNext).map((v) => ({ day: v, monthOffset: 1 })),
    ]
}

const getLastDayOfMonth = (x: Date): number => {
    return new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate()
}

const getFirstDayOfMonthStartingMonday = (x: Date) => {
    const newValue = x.getDay() - 1

    if (newValue === -1) {
        return 6
    }

    return newValue
}
