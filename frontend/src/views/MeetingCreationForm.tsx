import * as React from 'react'
import {Form, Formik} from "formik"
import {XMarkIcon} from "@heroicons/react/24/solid"
import { Input, LongInput } from "../components/Input"
import { Toggle } from '../components/Toggle'
import {DatePicker, FormDatePicker} from "../components/DatePicker";
import {FormInput, FormLongInput} from "../components/FormInput";
import {createMeeting} from "../api/meetings";

type Props = {
    
}


type MeetingCreateFormType = {
    title: string
    description: string
    start_time: Date
    hour: number
    minutes: number
    duration: number
}

const initialData: MeetingCreateFormType = {
    title: "",
    description: "",
    start_time: new Date(),
    hour: 0,
    minutes: 0,
    duration: 0,
}

export function MeetingCreationForm(props: Props) {

    const onSubmit = async (data: MeetingCreateFormType) => {
        const {hour, minutes, ...rest} = data
        rest.start_time.setHours(hour, minutes)
        await createMeeting(data)
    }

    return (
        <Formik initialValues={initialData} onSubmit={onSubmit}>
            <Form>
                <div className="grid grid-cols-2 p-2 gap-6">
                    <div className="flex flex-col gap-4">
                        <FormInput name="title" label="Meeting name" />

                        <div className="flex gap-4">
                            <FormInput label="Hour" name="hour" />
                            <FormInput label="Minute" name="minutes" />
                        </div>
                        <FormDatePicker label="Date" name="start_time"/>

                        <FormInput name="duration" label="Duration [m]" />

                        <FormLongInput label="Description" name="description"/>
                        <div className="text-right -mt-3 text-gray-400">0/50</div>

                        {/*<Input label="Meeting Url" name="meeting_url"/>*/}

                         <div className="flex align-middle">
                            <Toggle/>
                            <span className="ml-5"> Is private </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">


                        <Input label="Participants" name="participants"/>
                        <div>
                             <div className="flex">
                            <img src="https://randomuser.me/api/portraits/women/54.jpg" alt="person" className="h-6 w-6 rounded-full"/>
                            <span className="ml-1"> Jane Doe </span>
                            <XMarkIcon className="h-4 w-4 ml-auto self-center hover:ring rounded-full cursor-pointer"/>
                        </div>
                        </div>
                    </div>
                    <div/>
                    <div className="flex gap-8">
                        <button className="ml-auto px-3 py-1.5 rounded border-2 border-blue-700 text-blue-700 hover:bg-blue-100"> Cancel </button>
                        <button type="submit" className="px-3 py-1.5 rounded bg-blue-700 text-white"> Create </button>
                    </div>
                </div>
            </Form>
        </Formik>
    )
}