import * as React from 'react';
import {MeetingCreationDialog} from "./MeetingCreationDialog";
import {useEffect, useRef, useState} from "react";
import {range} from "../utils/range";

type Props = {}

const weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
]


export function CalendarWeekView(props: Props) {
    const hours = range(24).map(v => v)
    const currentTime = (() => {
        const d = new Date()
        console.log([d.getHours() + d.getMinutes(), d.getHours()])
        return d.getHours() * 60 + d.getMinutes()
    })()

    const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false)
    const calendarDivRef = useRef<HTMLDivElement | null>(null)

    const [hourLines, setHourLines] = useState<number[]>([])

    useEffect(() => {
        setHourLines(hours.map(v => heightForMinutes(v * 60)))
    }, [calendarDivRef])

    const heightForMinutes = (minutes: number) => {
        if (calendarDivRef.current === null) {
            return 0
        }


        const ratio = minutes / (24 * 60)

        return ratio * calendarDivRef.current!.getBoundingClientRect().height
    }

    return (
        <div className="p-6">
            <button onClick={() => setIsCreateMeetingOpen(true)} type="button" className="bg-blue-700 text-white rounded shadow p-2 font-light relative"> New meeting</button>
            <MeetingCreationDialog open={isCreateMeetingOpen} onClose={() => setIsCreateMeetingOpen(false)}/>
            <div className="grid grid-cols-6 items-stretch overflow-hidden relative">
                <div/>
                {
                    weekdays.map(day => <div key={day} className="p-3 text-center">
                        <p>{day}</p>
                    </div>)
                }
            </div>

            <div className="grid grid-cols-6 items-stretch overflow-x-hidden overflow-y-scroll relative h-[2000px]" ref={calendarDivRef}>
                <div/>
                <div className="relative mondays">
                    <div className="absolute bg-blue-300 rounded py-2 px-8 text-white h-20 top-[500px]"> Important meeting af </div>
                </div>

                <div className="relative tuesdays">
                    <div className="absolute bg-blue-500 rounded py-2 px-8 text-white" style={{top: heightForMinutes(9 * 60)}}> Important meeting af </div>
                </div>

                <div className="relative thursdays">
                    <div className="absolute bg-blue-500 rounded py-2 px-8 text-white" style={{top: heightForMinutes((12 * 60) + 30)}}> Important meeting af </div>
                </div>

                <div className="relative fridays">
                    <div className="absolute bg-gray-500 w-full rounded py-2 px-8 text-white" style={{top: heightForMinutes((12 * 60) + 30)}}> Reserved slot </div>
                </div>

                <span className="absolute border w-full border-red-600" style={{top: heightForMinutes(currentTime)}}/>

                {
                    hourLines.map((offset, idx) => (
                        <span className="absolute border-t w-full border-gray-600"
                              key={idx}
                              style={{top: offset}}
                        >
                            <span className="absolute top-1 text-sm text-gray-600"> {idx}:00 </span>
                        </span>
                    ))
                }
            </div>
        </div>
    )
}