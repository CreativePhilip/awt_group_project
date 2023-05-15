import * as React from "react"
import {PropsWithChildren, useEffect} from "react"
import {useUserStore} from "../userStore"
import {useNavigate} from "react-router-dom"


export const LoggedInRoute = (props: PropsWithChildren) => {
    const userStore = useUserStore()
    const navigate = useNavigate()

    useEffect(() => {
        userStore.isLoggedIn().then(isLoggedIn => {
            if (!isLoggedIn) {
                navigate("/login")
            }
        })
    }, [userStore])

    if (userStore.user === null) {
        return <></>
    }

    return props.children as JSX.Element
}