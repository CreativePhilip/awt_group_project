import * as React from "react"
import { Popover, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"

import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "@heroicons/react/20/solid"
import { computeDaysForMonth, DaysForMonthType } from "./datePickerUtils";

export type DatePickerProps = {
    initialDate?: Date
    onChange?: (date: Date) => void
}

const WEEKDAY_LABEL_CLASSES = "font-semibold text-center text-gray-500 mb-2"


export function MonthDisplay(props: DatePickerProps) {
    // TODO: Change position to above input when close to bottom screen edge
    const initialDate = props.initialDate ?? new Date()

    const [year, _] = useState(initialDate.getFullYear())
    const [month, setMonth] = useState(initialDate.getMonth())
    const testDate = new Date(year, month, 1)

    const daysList = computeDaysForMonth(testDate)

    const cornerRoundingClass = (idx: number, len: number) => {
        if (idx === 0) return " rounded-tl "
        if (idx === 6) return " rounded-tr "
        if (len - idx - 1 === 0) return " rounded-br "
        if (len - idx - 1 === 6) return " rounded-bl "
        return ""
    }

    const computeDayKey = (value: DaysForMonthType) => {
        if (value.monthOffset === 0) {
            return `${value.day} ${month} ${year}`
        }

        if (value.monthOffset === -1) {
            return `${value.day} ${month - 1} ${year}`
        }

        return `${value.day} ${month + 1} ${year}`
    }

    const isDateCurrent = (value: DaysForMonthType) => {
        if (value.monthOffset !== 0) return false
        return value.day === initialDate.getDate()
    }

    const onDayClicked = (value: DaysForMonthType) => {
        if (value.monthOffset === 0) {
            onCurrentMonthDayClicked(value.day)
        }
    }

    const onCurrentMonthDayClicked = (day: number) => {
        props.onChange?.(new Date(year, month, day))
    }

    return (
        <div className="">
            <div className=" max-w-md aspect-square p-2 rounded">


                <span className="mx-auto">
                    {testDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>

                <div className="mt-2 grid grid-cols-7 h-auto">
                    <div className={WEEKDAY_LABEL_CLASSES}>M</div>
                    <div className={WEEKDAY_LABEL_CLASSES}>T</div>
                    <div className={WEEKDAY_LABEL_CLASSES}>W</div>
                    <div className={WEEKDAY_LABEL_CLASSES}>T</div>
                    <div className={WEEKDAY_LABEL_CLASSES}>F</div>
                    <div className={WEEKDAY_LABEL_CLASSES}>S</div>
                    <div className={WEEKDAY_LABEL_CLASSES}>S</div>
                    {daysList.map((value, idx) => (
                        <button
                            className={`text-center border border-gray-300 p-2 cursor-pointer aspect-square
                         ${
                             value.monthOffset === 0
                                 ? "bg-white hover:bg-gray-100"
                                 : "bg-gray-200 text-gray-400"
                         } 
                         ${cornerRoundingClass(idx, daysList.length)}`}
                            key={computeDayKey(value)}
                            type="button"
                            onClick={() => onDayClicked(value)}
                        >
                            <span
                                className={`mx-auto flex h-full w-full text-sm items-center justify-center rounded-full ${
                                    isDateCurrent(value) ? "text-indigo-600 font-bold" : ""
                                }`}
                            >
                                {value.day}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}