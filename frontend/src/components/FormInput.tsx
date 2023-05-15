import * as React from "react"
import { useField } from "formik"
import {Input} from "./Input";


type FormInputProps = {
    label: string
    name: string
    type?: string
    placeholder?: string
    renderErrors?: boolean
}

export function FormInput(props: FormInputProps) {
    const [field, meta, helpers] = useField(props.name)

    const hasError = meta.touched && !!meta.error
    const renderErrors = props.renderErrors ?? true

    return (
        <div className="w-full">
            <Input
                name={props.name}
                label={props.label}
                onChange={helpers.setValue}
                onBlur={field.onBlur}
                type={props.type}
            />

            {
                hasError && renderErrors ? <p className="text-red-600"> {meta.error} </p> : null
            }
        </div>
    )
}