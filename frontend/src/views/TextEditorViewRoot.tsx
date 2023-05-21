import NavBar from "../components/NavBar";
import TextEditor from "../components/TextEditor";
import SecondaryButton from "../components/SecondaryButton";
import PrimaryButton from "../components/PrimaryButton";

export default function TextEditorViewRoot() {
  const onCancel = () => {};
  const onConfirm = () => {};
  return (
    <NavBar>
      <div className="flex justify-center">
        <div className="h-2/3 w-2/3 mt-4">
          <TextEditor />
        </div>
      </div>
      <div className="grid justify-items-end">
        <div className="flex mr-80 mt-4">
            <SecondaryButton onClick={onCancel} text="Cancel"/>
            <PrimaryButton onClick={onConfirm} text="Confirm"/>
        </div>
        
      </div>
      
    </NavBar>
  );
}
