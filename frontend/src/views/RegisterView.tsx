import * as React from 'react'
import * as yup from "yup"
import {Form, Formik} from "formik"
import {FormInput} from "../components/FormInput"
import {useEffect} from "react";
import {register} from "../api/login";
import {useNavigate} from "react-router-dom";


type RegisterFormType = {
    username: string
    email: string
    password: string
    password_repeat: string
}


const initialValues: RegisterFormType = {
    username: "",
    email: "",
    password: "",
    password_repeat: ""
}


const schema = yup.object<RegisterFormType>().shape({
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    password_repeat: yup.string().required().oneOf([yup.ref("password")], "Passwords must match")
})


export function RegisterView() {
    const navigate = useNavigate()

    const onSubmit = async (values: RegisterFormType) => {
        const hasRegistered = await register(values.username, values.email, values.password)

        if (hasRegistered) {
            navigate("/login")
        }
    }

    return (
        <div className="h-screen bg-blue-300 flex flex-col items-center">
            <div className="mt-12 w-1/3 bg-white rounded p-10">
                <h1 className="mb-4 font-semibold text-xl"> register </h1>
                <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
                    <Form>
                        <FormInput name="username" label="Username"/>
                        <FormInput name="email" label="Email"/>
                        <FormInput name="password" label="Password" type="password"/>
                        <FormInput name="password_repeat" label="Confirm password" type="password"/>

                        <button className="mt-10 w-full" type="submit"> Submit </button>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}