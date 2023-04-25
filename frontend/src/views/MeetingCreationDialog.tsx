import * as React from "react"
import { Dialog } from "@headlessui/react"
import {MeetingCreationForm} from "./MeetingCreationForm";

type Props = {
    open: boolean
    onClose: (createdMeeting: boolean) => void
}

export function MeetingCreationDialog(props: Props) {
    return (
        <Dialog open={props.open} onClose={() => props.onClose(false)} as="div" className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center">
                <Dialog.Panel className="bg-white rounded p-6 w-1/2">
                    <Dialog.Title className="text-2xl font-semibold"> Create meeting </Dialog.Title>
                    <Dialog.Description className="text-gray-500">
                        Create a new meeting and have fun
                    </Dialog.Description>
                    <div className="mt-4 max-h-[80vh] overflow-y-scroll">
                        <MeetingCreationForm/>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}
