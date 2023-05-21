import {ReactNode} from "react";

export default function Nullable({children, display}: {children: ReactNode, display: Boolean}){
    if (display) {
        return <>children</>;
    }
    return null;
}