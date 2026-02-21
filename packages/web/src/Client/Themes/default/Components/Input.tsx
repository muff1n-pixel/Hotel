import { CSSProperties, ReactNode } from "react";

import "./Input.css";

export type InputProps = {
    type?: string;
    value: string;
    onChange: (value: string) => void;
    style?: CSSProperties;
}

export default function Input({ type = "text", value, onChange, style }: InputProps) {
    return (
        <input className="input" style={style} type={type} value={value} onChange={(event) => onChange((event.target as HTMLInputElement).value)}/>
    );
}
