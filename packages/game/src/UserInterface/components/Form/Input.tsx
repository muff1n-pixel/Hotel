import { CSSProperties } from "react";

export type InputProps = {
    type?: "text" | "number";
    placeholder?: string;
    style?: CSSProperties;
    value: string;
    onChange: (value: string) => void;
    min?: number;
    max?: number;
    step?: number;
}

export default function Input({ style, step, type = "text", placeholder, value, onChange, min, max }: InputProps) {
    return (
        <div style={{
            borderBottom: "1px solid #FFFFFF",
            borderRadius: 6
        }}>
            <div style={{
                background: "#FFFFFF",
                border: "1px solid #808080",
                borderRadius: 6,

                height: 24,

                display: "flex",
                flexDirection: "row"
            }}>
                <input
                    type={type}
                    step={step}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onChange((event.currentTarget as HTMLInputElement).value)}
                    min={min}
                    max={max}
                    style={{
                        flex: 1,
                        background: "none",
                        border: "none",
                        ...style
                    }}/>
            </div>
        </div>
    );
}
