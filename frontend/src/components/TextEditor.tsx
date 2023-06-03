import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


interface Props{
  value: string,
  setValue: (v: string) => void 
}


export default function TextEditor(props: Props) {
  const {value, setValue} = props;

  return (
      <ReactQuill theme="snow" value={value} onChange={setValue} />
  );
}