import { CSSProperties, PropsWithChildren } from "react";
import DialogHeader from "./DialogHeader";
import useDialogMovement from "./Hooks/useDialogMovement";

export type DialogProps = PropsWithChildren & {
    title: string;
    width: number;
    height: number;
    hidden?: boolean;
    onClose?: () => void;
    initialPosition?: "corner" | "center";
    style?: CSSProperties;
};

export default function Dialog({ title, children, hidden, onClose, initialPosition = "corner", width, height, style }: DialogProps) {
    const { elementRef, onDialogFocus, onMouseDown } = useDialogMovement((initialPosition === "corner")?(
        {
            left: 200,
            top: 200
        }
    ):(
        {
            left: Math.round((window.innerWidth - width) / 2),
            top: Math.round((window.innerHeight - height) / 2)
        }
    ));

    return (
        <div ref={elementRef} style={{
            border: "1px solid black",
            borderRadius: 7,

            backgroundColor: "#ECEAE0",

            width,
            height: height,

            left: 0,
            top: 0,

            overflow: "hidden",

            position: "fixed",

            display: "flex",
            flexDirection: "column",

            pointerEvents: (!hidden)?("auto"):("none"),
            opacity: (!hidden)?(undefined):(0),

            ...style
        }} onMouseDown={onDialogFocus}>
            <DialogHeader title={title} onDialogMove={onMouseDown} onClose={onClose}/>

            <div style={{
                height: 1,
                width: "100%",
                backgroundColor: "black"
            }}/>

            {children}
        </div>
    );
}
