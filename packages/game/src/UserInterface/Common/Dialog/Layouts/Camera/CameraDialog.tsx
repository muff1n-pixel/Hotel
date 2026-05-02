import useDialogMovement from "@UserInterface/Common/Dialog/Hooks/useDialogMovement";
import { ReactNode } from "react";

export type CameraDialogProps = {
    title: string;
    initialPosition?: "corner" | "center";
    onClose?: () => void;
    children?: ReactNode;
}

export default function CameraDialog({ title, initialPosition, onClose, children }: CameraDialogProps) {
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
        <div ref={elementRef} onMouseDown={onDialogFocus} className="sprite_room_camera_background" style={{
            position: "fixed",
            pointerEvents: "auto"
        }}>
            <div style={{
                width: "100%",
                height: 36,
                minHeight: 36,

                boxSizing: "border-box",
                borderBottom: "none",

                display: "flex",

                justifyContent: "center",
                alignItems: "center",

                position: "relative"
            }} onMouseDown={onMouseDown}>
                <div style={{
                    fontSize: 13,
                    pointerEvents: "none"
                }}>
                    <b>{title}</b>
                </div>

                <div style={{
                    position: "absolute",
                    right: 10,
                    top: 10,

                    display: "flex",
                    flexDirection: "row",
                    gap: 5
                }}>
                    <div className="sprite_dialog_close" onClick={onClose} style={{
                        cursor: "pointer"
                    }}/>
                </div>
            </div>

            <div style={{
                position: "absolute",

                width: 320,

                left: 11,
                right: 11,

                top: 38,

                display: "flex",
                flexDirection: "column",
                gap: 5
            }}>
                {children}
            </div>
        </div>
    );
}