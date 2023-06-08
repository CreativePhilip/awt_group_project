import * as React from 'react';
import {MeetingCreationDialog} from "./MeetingCreationDialog";
import {useEffect, useRef, useState} from "react";
import {range} from "../utils/range";
import {Meeting, MeetingsByWeekday} from "../api/models/meeting";
import {listMeetings, listMeetingsInWeek} from "../api/meetings";
import { useNavigate } from "react-router-dom";
import SecondaryButton from '../components/SecondaryButton';

type Props = {}

const weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
]


export function CalendarWeekView(props: Props) {
    const {meetings, reload} = useMeetings()
    const hours = range(24).map(v => v)
    const currentTime = (() => {
        const d = new Date()
        return d.getHours() * 60 + d.getMinutes()
    })()
    
    const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false)
    const calendarDivRef = useRef<HTMLDivElement | null>(null)

    const [hourLines, setHourLines] = useState<number[]>([])

    const navigate = useNavigate();

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

    const topForMeeting = (meeting: Meeting) => {
        const date = new Date(meeting.start_time)
        return heightForMinutes((date.getHours() * 60) + date.getMinutes())
    }

    const heightForMeeting = (meeting: Meeting) => {
        if (meeting.total_minutes <= 30) {
            return heightForMinutes(30)
        }
        return heightForMinutes(meeting.total_minutes)
    }

    return (
        <div className="p-6">
            <div className="flex justify-between">
                <button onClick={() => setIsCreateMeetingOpen(true)} type="button"
                        className="bg-blue-700 text-white rounded shadow p-2 font-light relative"> New meeting
                </button>
                <SecondaryButton onClick={()=>navigate("/meetings_duration")} text='Time on meetings'/>
            </div>
            
            <MeetingCreationDialog open={isCreateMeetingOpen} onClose={() => {
                setIsCreateMeetingOpen(false)
                reload()
            }}/>
            <div className="grid grid-cols-6 items-stretch overflow-hidden relative">
                <div/>
                {
                    weekdays.map(day => <div key={day} className="p-3 text-center">
                        <p>{day}</p>
                    </div>)
                }
            </div>

            <div
                className="grid grid-cols-6 gap-6 items-stretch overflow-x-hidden overflow-y-scroll relative h-[2000px]"
                ref={calendarDivRef}>
                <div/>
                <div className="relative mondays">
                    {
                        meetings.monday.map(meeting => (
                            <MeetingCard
                                key={meeting.id}
                                meeting={meeting}
                                top={topForMeeting(meeting)}
                                height={heightForMeeting(meeting)}
                            />
                        ))
                    }
                </div>

                <div className="relative tuesdays">
                    {
                        meetings.tuesday.map(meeting => (
                            <MeetingCard
                                key={meeting.id}
                                meeting={meeting}
                                top={topForMeeting(meeting)}
                                height={heightForMeeting(meeting)}
                            />
                        ))
                    }
                </div>

                <div className="relative wednesday">
                    {
                        meetings.wednesday.map(meeting => (
                            <MeetingCard
                                key={meeting.id}
                                meeting={meeting}
                                top={topForMeeting(meeting)}
                                height={heightForMeeting(meeting)}
                            />
                        ))
                    }
                </div>

                <div className="relative thursdays">
                    {
                        meetings.thursday.map(meeting => (
                            <MeetingCard
                                key={meeting.id}
                                meeting={meeting}
                                top={topForMeeting(meeting)}
                                height={heightForMeeting(meeting)}
                            />
                        ))
                    }
                </div>

                <div className="relative fridays">
                    {
                        meetings.friday.map(meeting => (
                            <MeetingCard
                                key={meeting.id}
                                meeting={meeting}
                                top={topForMeeting(meeting)}
                                height={heightForMeeting(meeting)}
                            />
                        ))
                    }
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


function MeetingCard({meeting, top, height}: { meeting: Meeting, top: number, height: number }) {
    const navigate = useNavigate();
    return <div
        className="absolute bg-blue-500 rounded py-2 px-8 text-white w-full"
        onClick={()=>{navigate("/meetings_note", {
            state: {
                meetingId: meeting.id
            }
        })}}
        style={{top, height}}>
        {meeting.title} {meeting.total_minutes} {meeting.participants.length}
        
    </div>
}


function useMeetings() {
    const initial: MeetingsByWeekday = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
    }
    const [meetings, setMeetings] = useState<MeetingsByWeekday>(initial)

    useEffect(() => {
        reload()
    }, [])


    const reload = () => {
        // listMeetings().then(meetings => {
        //     setMeetings(meetings)
        // })

        listMeetingsInWeek(new Date()).then(meetings => {
            setMeetings(meetings)
        })
    }

    return {meetings, reload}
}