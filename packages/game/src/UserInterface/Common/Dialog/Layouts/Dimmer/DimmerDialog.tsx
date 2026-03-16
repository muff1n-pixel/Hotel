import useDialogMovement from "@UserInterface/Common/Dialog/Hooks/useDialogMovement";
import { ReactNode } from "react";

export type DimmerDialogProps = {
    title: string;
    initialPosition?: "corner" | "center";
    onClose?: () => void;
    children?: ReactNode;
}

export default function DimmerDialog({ title, initialPosition, onClose, children }: DimmerDialogProps) {
    const { elementRef, onDialogFocus, onMouseDown } = useDialogMovement((initialPosition === "corner")?(
        {
            left: 200,
            top: 200
        }
    ):(
        {
            left: Math.round((window.innerWidth - 250) / 2),
            top: Math.round((window.innerHeight - 280) / 2)
        }
    ));
    
    return (
        <div ref={elementRef} onMouseDown={onDialogFocus} className="sprite_dialog_roomdimmer_background" style={{
            position: "fixed",
            pointerEvents: "auto"
        }}>
            <div style={{
                position: "absolute",
                
                left: 0,
                top: 0,

                height: 25,
                width: "100%",

                display: "flex",
                alignItems: "center",

                paddingLeft: 35,
                paddingBottom: 2,

                boxSizing: "border-box"
            }} onMouseDown={onMouseDown}>
                <div style={{
                    fontSize: 12,
                    pointerEvents: "none",
                    color: "#7F5D0B"
                }}>
                    <b>{title}</b>
                </div>

                <div className="sprite_dialog_roomdimmer_close" style={{
                    position: "absolute",

                    top: 7,
                    right: 13,

                    cursor: "pointer"
                }} onClick={onClose}/>
            </div>

            <div style={{
                position: "absolute",

                width: 246,
                height: 171,

                left: 25,
                top: 25,

                padding: "6px 12px",
                boxSizing: "border-box",

                color: "#00ED1F",
                fontSize: 12,

                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",

                gap: 10
            }}>
                {children}
            </div>
        </div>
    );
}