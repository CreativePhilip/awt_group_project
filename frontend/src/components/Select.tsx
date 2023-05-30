import { ChangeEvent } from "react";
import Nullable from "./Nullable";

export interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  onChange: (o: any)=>void;
  containerStyle?: string;
  label?: string;
}

export default function SelectOption(props: Props) {
  const { options, label, onChange, containerStyle } = props;
  return (
    <div className={containerStyle}>
      <Nullable display={label != undefined}>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          {label}
        </label>
      </Nullable>

      <select
        id="small"
        className={`block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-5000`}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        defaultValue="default"
      >
        <option disabled value="default">Select...</option>
        {options.map((o: Option) => <option value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
