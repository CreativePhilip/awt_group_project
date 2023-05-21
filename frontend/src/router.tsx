import { createBrowserRouter } from "react-router-dom"
import { CalendarViewRoot }    from "./views/CalendarViewRoot"
import React from "react";
import { CalendarWeekView } from "./views/CalendarWeekView";
import {LoginView} from "./views/LoginView";
import {LoggedInRoute} from "./components/LoggedInRoute";
import {RegisterView} from "./views/RegisterView";
import TextEditor from "./components/TextEditor";
import MeetingsDurationGraph from "./components/MeetingDurationGraph";


export const router = createBrowserRouter([
    {
        path   : "/login",
        element: <LoginView/>,
    },
    {
        path   : "/register",
        element: <RegisterView/>
    },
    {
        path   : "/",
        element: <CalendarViewRoot/>,
        children: [
            {
                path: "/week",
                element: <LoggedInRoute> <CalendarWeekView/> </LoggedInRoute>
            }
        ]
    },
    {
        path    : "/text_editor",
        element: <TextEditor></TextEditor>
    },
    {
        path    : "/meetings_duration",
        element: <MeetingsDurationGraph/>
    }
])
