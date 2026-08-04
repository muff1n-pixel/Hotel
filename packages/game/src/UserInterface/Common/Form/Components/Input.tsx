import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { CSSProperties, ReactNode } from "react";

import "./Input.css";

export type InputProps = {
    type?: "text" | "password" | "number";
    placeholder?: string;
    style?: CSSProperties;
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    min?: number;
    max?: number;
    step?: number;
    readonly?: boolean;
    maxLength?: number;
    children?: ReactNode;
}

export default function Input({ style, readonly, step, type = "text", placeholder, value, onChange, onSubmit, min, max, maxLength, children }: InputProps) {
    return (
        <div style={{
            borderBottom: "1px solid #FFFFFF",
            borderRadius: 6,
        }}>
            <div style={{
                background: "#FFFFFF",
                border: "1px solid #808080",
                borderRadius: 6,

                paddingRight: 6,
                paddingLeft: 4,

                height: 24,

                display: "flex",
                flexDirection: "row",

                alignItems: "center"
            }}>
                <input
                    type={type}
                    className="input"
                    readOnly={readonly}
                    step={step}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onChange?.((event.currentTarget as HTMLInputElement).value)}
                    onKeyDown={(event) => {
                        if(event.key === "Enter") {
                            onSubmit?.(value ?? "");
                        }
                    }}
                    min={min}
                    max={max}
                    maxLength={maxLength}
                    style={{
                        flex: 1,
                        width: 0,
                        background: "none",
                        border: "none",
                        ...style
                    }}/>

                {(type === "number") && (
                    <FlexLayout direction="column" gap={4} align="center" justify="center">
                        <div className="sprite_forms_arrow" style={{
                            cursor: "pointer",
                            transform: "rotateZ(-180deg)"
                        }} onClick={() => {
                            const number = Number(value);

                            if (Number.isNaN(number)) {
                                return;
                            }

                            let newValue = number + (step ?? 1);

                            if(min !== undefined) {
                                newValue = Math.max(min, newValue);
                            }

                            if(max !== undefined) {
                                newValue = Math.min(max, newValue);
                            }

                            onChange?.(newValue.toString());
                        }}/>
                        
                        <div className="sprite_forms_arrow" style={{
                            cursor: "pointer"  
                        }} onClick={() => {
                            const number = Number(value);

                            if (Number.isNaN(number)) {
                                return;
                            }

                            let newValue = number - (step ?? 1);

                            if(min !== undefined) {
                                newValue = Math.max(min, newValue);
                            }

                            if(max !== undefined) {
                                newValue = Math.min(max, newValue);
                            }

                            onChange?.(newValue.toString());
                        }}/>
                    </FlexLayout>
                )}

                {children}
            </div>
        </div>
    );
}
