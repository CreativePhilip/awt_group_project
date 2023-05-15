import * as React from 'react'
import * as yup from "yup"
import {Form, Formik} from "formik"
import {FormInput} from "../components/FormInput";
import {login} from "../api/login";
import {useNavigate} from "react-router-dom";
import {useUserStore} from "../userStore";
import {useEffect} from "react";


type LoginFormType = {
    login: string
    password: string
}

const initialValues: LoginFormType = {
    login: "",
    password: ""
}

const schema = yup.object<LoginFormType>().shape({
    login: yup.string().required(),
    password: yup.string().required()
})

export function LoginView() {
    const navigate = useNavigate()
    const userStore = useUserStore()

    useEffect(() => {
        handleRedirect().then()
    }, [userStore])

    const handleRedirect = async () => {
        const isLoggedIn = await userStore.isLoggedIn()

        if (isLoggedIn) {
            navigate("/week")
        }
    }

    const onSubmit = async (data: LoginFormType) => {
        await login(data.login, data.password)
        await userStore.loadUser()
    }

    return (
        <div className="h-screen bg-blue-300 flex flex-col items-center">
            <div className="mt-12 w-1/3 bg-white rounded p-10">
                <h1 className="mb-4 font-semibold text-xl"> login </h1>
                <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
                    <Form>
                        <FormInput name="login" label="Username"/>
                        <FormInput name="password" label="Password" type="password"/>

                        <button className="mt-10 w-full" type="submit"> Submit </button>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}