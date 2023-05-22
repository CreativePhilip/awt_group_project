import * as React from 'react';

type Props = {
    label: string
    name: string
    type?: string
    onChange?: (value: string) => void
    onBlur?: (e: any) => void
}

export function Input(props: Props) {
    const type = props.type ?? "text"
    return (
        <div>
            <label htmlFor={props.name} className="block text-gray-500">{props.label}</label>
            <input
                type={type}
                name={props.name}
                onChange={e => props.onChange?.(e.target.value)}
                onBlur={e => props.onBlur?.(e)}
                className="border focus:border-blue-500 focus:ring-blue-500 border-gray-600 px-2 py-1.5 w-full rounded"
            />
        </div>
    )
}

export function LongInput(props: Props) {
    return (
        <div>
            <label htmlFor={props.name} className="block text-gray-500">{props.label}</label>
            <textarea
                name={props.name}
                onChange={e => props.onChange?.(e.target.value)}
                onBlur={e => props.onBlur?.(e)}
                className="border focus:ring-0 border-gray-600 px-2 py-1.5 w-full rounded"
            />
        </div>
    )
}