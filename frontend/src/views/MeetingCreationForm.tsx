import * as React from 'react'
import {Form, Formik, useField} from "formik"
import {XMarkIcon} from "@heroicons/react/24/solid"
import {Input, LongInput} from "../components/Input"
import {Toggle} from '../components/Toggle'
import {DatePicker, FormDatePicker} from "../components/DatePicker";
import {FormInput, FormLongInput} from "../components/FormInput";
import {createMeeting} from "../api/meetings";
import {searchUsers} from "../api/users";
import {useEffect, useState} from "react";
import {useDebounce} from "../hooks/useDebounce";
import {User} from "../api/models/user";

type Props = {
    onSubmit: () => void
}


type MeetingCreateFormType = {
    title: string
    description: string
    start_time: Date
    hour: number
    minutes: number
    duration: number
    participants: User[]
}

const initialData: MeetingCreateFormType = {
    title: "",
    description: "",
    start_time: new Date(),
    hour: 0,
    minutes: 0,
    duration: 0,
    participants: []
}

export function MeetingCreationForm(props: Props) {
    const onSubmit = async (data: MeetingCreateFormType) => {
        const {hour, minutes, participants, ...rest} = data
        rest.start_time.setHours(hour, minutes)

        const finalData = {...rest, participants: participants.map(u => u.id)}
        await createMeeting(finalData)
        props.onSubmit()
    }

    return (
        <Formik initialValues={initialData} onSubmit={onSubmit}>
            <Form>
                <div className="grid grid-cols-2 p-2 gap-6">
                    <div className="flex flex-col gap-4">
                        <FormInput name="title" label="Meeting name"/>

                        <div className="flex gap-4">
                            <FormInput label="Hour" name="hour"/>
                            <FormInput label="Minute" name="minutes"/>
                        </div>
                        <FormDatePicker label="Date" name="start_time"/>

                        <FormInput name="duration" label="Duration [m]"/>

                        <FormLongInput label="Description" name="description"/>
                        <div className="text-right -mt-3 text-gray-400">0/50</div>

                        <div className="flex align-middle">
                            <Toggle/>
                            <span className="ml-5"> Is private </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">

                        <PersonSelector/>


                    </div>
                    <div/>
                    <div className="flex gap-8">
                        <button
                            className="ml-auto px-3 py-1.5 rounded border-2 border-blue-700 text-blue-700 hover:bg-blue-100"> Cancel
                        </button>
                        <button type="submit" className="px-3 py-1.5 rounded bg-blue-700 text-white"> Create</button>
                    </div>
                </div>
            </Form>
        </Formik>
    )
}


export function PersonSelector() {
    const [field, meta, helpers] = useField<User[]>("participants")
    const fieldUserIDs = field.value.map(u => u.id)

    const [query, setQuery] = useState("")
    const queriedUsers = useLoadPeople(query)
    const filteredUsers = queriedUsers.filter(user => !fieldUserIDs.includes(user.id))

    const onUserAdd = (u: User) => {
        helpers.setValue([...field.value, u])
    }

    const onUserRemove = (u: User) => {
        const newUsers = field.value.filter(testU => testU.id !== u.id)
        helpers.setValue(newUsers)
    }

    return (
        <div>
            <Input label="Participants" name="participants" onChange={setQuery}/>
            <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="mb-4"> Participants </p>
                        <div className="flex flex-col gap-2">
                            {
                                field.value.map(u => (
                                    <div className="flex" key={u.id}>
                                        <img src="https://randomuser.me/api/portraits/women/54.jpg"
                                             alt="person"
                                             className="h-6 w-6 rounded-full"/>
                                        <span className="ml-1"> {u.username} </span>
                                        <button onClick={() => onUserRemove(u)} className="ml-auto">
                                            <XMarkIcon
                                                className="h-4 w-4 self-center hover:ring rounded-full cursor-pointer"/>
                                        </button>
                                    </div>
                                ))
                            }
                        </div>

                    </div>

                    <div>
                        <p className="mb-4"> Queried </p>
                        <div className="flex flex-col gap-2">
                            {
                                filteredUsers.map(u => (
                                    <div className="flex" key={u.id}>
                                        {u.username}
                                        <button className="ml-auto" type="button" onClick={() => onUserAdd(u)}>
                                            add
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}


function useLoadPeople(query: string) {
    const newQuery = useDebounce(query, 150)
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        searchUsers(newQuery).then(setUsers)
    }, [newQuery])

    return users
}