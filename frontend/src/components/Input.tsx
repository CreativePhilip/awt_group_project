import * as React from 'react';

type Props = {
    label: string
    name: string
}

export function Input(props: Props) {
    return (
        <div>
            <label htmlFor={props.name} className="block text-gray-500">{props.label}</label>
            <input type="text" name={props.name} className="border focus:border-blue-500 focus:ring-blue-500 border-gray-600 px-2 py-1.5 w-full rounded"/>
        </div>
    )
}

export function LongInput(props: Props) {
    return (
        <div>
            <label htmlFor={props.name} className="block text-gray-500">{props.label}</label>
            <textarea name={props.name} className="border focus:ring-0 border-gray-600 px-2 py-1.5 w-full rounded"/>
        </div>
    )
}