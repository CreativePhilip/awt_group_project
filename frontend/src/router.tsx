import { createBrowserRouter } from "react-router-dom"
import { CalendarViewRoot }    from "./views/CalendarViewRoot"
import LoginInterface from "./components/LoginInterface"
import RegisterInterface from "./components/LoginInterface"


export const router = createBrowserRouter([
    {
        path   : "/login",
        element: <div><LoginInterface/></div>,
    },
    {
        path   : "/register",
        element: <div><RegisterInterface/></div>
    },
    {
        path   : "/",
        element: <CalendarViewRoot/>
    }
])
