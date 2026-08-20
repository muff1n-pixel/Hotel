import { ReactNode } from "react";

export type PetProgressBarProps = {
    value: number;
    maxValue: number;

    title: string;
    icon: ReactNode;

    primaryBackgroundColor: string;
    secondaryBackgroundColor: string;
};

export default function PetProgressBar({ value, maxValue, title, icon, primaryBackgroundColor, secondaryBackgroundColor }: PetProgressBarProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            fontSize: 10,
        }}>
            <div style={{
                textAlign: "center"
            }}>
                {title}
            </div>

            <div style={{
                border: "1px solid #FFFFFF",
                height: 14,
                width: "100%",

                position: "relative"
            }}>
                <div style={{
                    position: "absolute",

                    left: 0,
                    top: 0,

                    width: `${(value / maxValue) * 100}%`,
                    height: "100%",

                    background: `linear-gradient(to bottom, ${primaryBackgroundColor} 4px, ${secondaryBackgroundColor} 4px)`
                }}/>
                
                <div style={{
                    position: "absolute",

                    left: 0,
                    top: 0,

                    paddingTop: 1,

                    width: "100%",
                    height: "100%",

                    textAlign: "center"
                }}>
                    {value}/{maxValue}
                </div>

                <div style={{
                    position: "absolute",

                    left: 0,
                    top: 0,

                    transform: "translateX(-50%) translateY(calc(-50% + 7px))"
                }}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
