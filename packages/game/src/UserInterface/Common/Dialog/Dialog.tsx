import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import DialogHeader from "./Components/DialogHeader";
import useDialogMovement from "./Hooks/useDialogMovement";

export type DialogProps = PropsWithChildren & {
    title: ReactNode;
    width: number;
    hidden?: boolean;
    onClose?: () => void;
    onEditClick?: (() => void) | false;
    initialPosition?: "corner" | "center";
    style?: CSSProperties;
} & ({
    height: "auto";
    assumedHeight: number;
} | {
    height: number;
    assumedHeight?: number;
});

export default function Dialog({ title, children, hidden, onEditClick, onClose, initialPosition: initialPositionPlacement = "corner", width, height, assumedHeight, style }: DialogProps) {
    const { elementRef, onDialogFocus, onMouseDown, initialPosition } = useDialogMovement((initialPositionPlacement === "corner")?(
        {
            left: 200,
            top: 200
        }
    ):(
        {
            left: Math.round((window.innerWidth - width) / 2),
            top: Math.round((window.innerHeight - ((height === "auto")?(assumedHeight):(height))) / 2)
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

            transform: `translate(${initialPosition.left}px, ${initialPosition.top}px)`,

            overflow: "hidden",

            position: "fixed",

            display: "flex",
            flexDirection: "column",

            pointerEvents: (!hidden)?("auto"):("none"),
            opacity: (!hidden)?(undefined):(0),

            ...style
        }} onMouseDown={onDialogFocus}>
            <DialogHeader title={title} onDialogMove={onMouseDown} onEditClick={onEditClick} onClose={onClose}/>

            <div style={{
                height: 1,
                width: "100%",
                backgroundColor: "black"
            }}/>

            {children}
        </div>
    );
}
