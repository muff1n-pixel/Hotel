import { CSSProperties } from "react";

export type TextAreaProps = {
    placeholder?: string;
    style?: CSSProperties;
    value: string;
    onChange: (value: string) => void;
}

export default function TextArea({ style, placeholder, value, onChange }: TextAreaProps) {
    return (
        <div style={{
            borderBottom: "1px solid #FFFFFF",
            borderRadius: 6
        }}>
            <div style={{
                background: "#FFFFFF",
                border: "1px solid #808080",
                borderRadius: 6,

                display: "flex",
                flexDirection: "row"
            }}>
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onChange((event.currentTarget as HTMLTextAreaElement).value)}
                    style={{
                        flex: 1,
                        background: "none",
                        border: "none",
                        resize: "none",
                        fontFamily: "Ubuntu",
                        fontSize: 12,
                        ...style
                    }}/>
            </div>
        </div>
    );
}
