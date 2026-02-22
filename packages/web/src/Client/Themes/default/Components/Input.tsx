import { CSSProperties, ReactNode } from "react";

import "./Input.css";

export type InputProps = {
    type?: string;
    value: string;
    onChange: (value: string) => void;
    style?: CSSProperties;
    maxlength?: number | undefined;
}

export default function Input({ type = "text", value, maxlength = undefined, onChange, style }: InputProps) {
    return (
        <input className="input" style={style} type={type} maxLength={maxlength} value={value} onChange={(event) => onChange((event.target as HTMLInputElement).value)}/>
    );
}
