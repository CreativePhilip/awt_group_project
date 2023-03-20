import { createBrowserRouter } from "react-router-dom"
import { CalendarViewRoot }    from "./views/CalendarViewRoot"


export const router = createBrowserRouter([
    {
        path   : "/login",
        element: <div>Hello world! Login</div>,
    },
    {
        path   : "/register",
        element: <div> Hello world! Register </div>
    },
    {
        path   : "/",
        element: <CalendarViewRoot/>
    }
])