import * as React from 'react'
import { Outlet } from "react-router-dom"
import {MonthDisplay} from "../components/MonthDisplay";

type Props = {}

export function CalendarViewRoot(props: Props) {
    return (
            <div className="flex flex-col h-screen">
                <nav className="flex items-center py-2 px-16 shadow-lg">
                    <img className="h-10" src="/logo.png" alt="Logo"/>
                    <div className="ml-auto flex justify-center items-center rounded-full bg-blue-500 w-8 h-8">
                        <div className="text-white">P</div>
                    </div>
                </nav>

                <main className="flex flex-grow flex-row gap-4">
                    <div className="bg-gray-100 p-6">
                        <MonthDisplay />
                    </div>
                    <div className="w-full">
                        <Outlet/>
                    </div>
                </main>
            </div>
    )
}
