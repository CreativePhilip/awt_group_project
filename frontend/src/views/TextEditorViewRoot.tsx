import NavBar from "../components/NavBar";
import TextEditor from "../components/TextEditor";
import SecondaryButton from "../components/SecondaryButton";
import PrimaryButton from "../components/PrimaryButton";
import { addMeetingNote, getMeeting } from "../api/meetings";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import notFound from '../assets/notFound.jpg';


export default function TextEditorViewRoot() {
  const navigate = useNavigate();
  const [note, setNote] = useState<string>("");
  const location = useLocation();
  const meetingId = location.state?.meetingId;

  const onConfirm = async () => {
    await addMeetingNote(meetingId, {"note": note});
    navigate("/week")
  }
  const onCancel = () => {navigate("/week")};
  const getMeetingNote = async () => {
    const meeting = await getMeeting(meetingId);
    const note = meeting?.note;
    if (note==undefined){
      setNote("");
    } else {
      setNote(note);
    }
  }

  if (meetingId==null) {
    return <div className="flex justify-center items-center h-screen">
      <img src={notFound}/>
    </div>
  }

  useEffect(()=>{
    getMeetingNote();
  },[])

  return (
    <>
      <div className="flex justify-center">
        <div className="h-2/3 w-2/3 mt-4">
          <TextEditor value={note} setValue={setNote}/>
        </div>
      </div>
      <div className="grid justify-items-end">
        <div className="flex mr-80 mt-4">
            <SecondaryButton onClick={onCancel} text="Cancel"/>
            <PrimaryButton onClick={onConfirm} text="Confirm"/>
        </div>
        
      </div>
    </>
  );
}
