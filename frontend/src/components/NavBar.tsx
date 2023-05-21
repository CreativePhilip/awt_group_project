import { ReactNode } from "react"

interface Props {
    children: ReactNode
}

export default function NavBar(props: Props){
    return (
        <div className="flex flex-col h-screen">
            <nav className="flex items-center py-2 px-16 shadow-lg">
                <img className="h-10" src="/logo.png" alt="Logo"/>
                <div className="ml-auto flex justify-center items-center rounded-full bg-blue-500 w-8 h-8">
                    <div className="text-white">P</div>
                </div>
            </nav>
            {props.children}
        </div>
    );
}