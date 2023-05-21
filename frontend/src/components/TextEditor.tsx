import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function TextEditor() {
  const [value, setValue] = useState('Insert your note here...');

  return (
      <ReactQuill theme="snow" value={value} onChange={setValue} />
  );
}