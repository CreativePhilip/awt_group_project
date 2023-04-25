import * as React from "react"
import { Popover, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"

import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "@heroicons/react/20/solid"
import { computeDaysForMonth, DaysForMonthType } from "./datePickerUtils";

export type DatePickerProps = {
    label: string
    initialDate?: Date
    onChange?: (date: Date) => void
}


const WEEKDAY_LABEL_CLASSES = "font-semibold text-center text-gray-500 mb-2"


export function DatePicker(props: DatePickerProps) {
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
        <div className="w-full">
            <p className="text-sm font-medium leading-6 text-gray-900">{props.label}</p>
            <Popover className="relative mt-2">
                <Popover.Button
                    className="w-full rounded-md shadow-sm border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300
                     placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-left
                     flex gap-4"
                >
                    <CalendarIcon className="h-6 w-6" />
                    {initialDate.toLocaleDateString(navigator.languages[0])}
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <Popover.Panel className="absolute left-0 top-14 transform z-10 bg-white max-w-md aspect-square p-6 shadow-2xl rounded-2xl border border-gray-300 ">
                        <div className="text-lg font-semibold flex mb-4">
                            <button type="button" onClick={() => setMonth((curr) => curr - 1)}>
                                <ChevronLeftIcon className="h-6 w-6" />
                            </button>

                            <span className="mx-auto">
                                {testDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </span>

                            <button type="button" onClick={() => setMonth((curr) => curr + 1)}>
                                <ChevronRightIcon className="h-6 w-6" />
                            </button>
                        </div>
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
                                    className={`text-center border border-gray-300 p-2 cursor-pointer
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
                                        className={`mx-auto flex h-5 w-5 items-center justify-center rounded-full ${
                                            isDateCurrent(value) ? "bg-indigo-600 text-white font-semibold" : ""
                                        }`}
                                    >
                                        {value.day}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </Popover.Panel>
                </Transition>
            </Popover>
        </div>
    )
}