import { CSSProperties, PropsWithChildren } from "react";
import useDialogMovement from "../Hooks/useDialogMovement";

export type WiredDialogProps = PropsWithChildren & {
    hidden?: boolean;
    onClose?: () => void;
    onEditClick?: (() => void) | false;
    initialPosition?: "corner" | "center";
    style?: CSSProperties;
};

export default function WiredDialog({ children, hidden, onClose }: WiredDialogProps) {
    const { elementRef, onDialogFocus, onMouseDown } = useDialogMovement();

    if(hidden) {
        return null;
    }

    return (
        <div ref={elementRef} onMouseDown={onDialogFocus} style={{
            display: "flex",

            position: "fixed",
            pointerEvents: "auto",

            border: "1px solid black",
            borderRadius: 6,

            fontSize: 12,

            textShadow: "rgba(255, 255, 255, .5) 0 0 1px"
        }}>
            <div style={{
                flex: 1,

                border: "1px solid #3D3D3D",
                borderBottomColor: "#222222",
                borderRightColor: "#222222",
                borderRadius: 6,

                display: "flex",
            }}>
                <div style={{
                    flex: 1,

                    border: "1px solid #666666",
                    borderRadius: 6,

                    background: "#3D3D3D",

                    display: "flex",
                    flexDirection: "column",

                    width: 240,
                    padding: 2,

                    gap: 5
                }}>
                    <div style={{
                        height: 15,

                        backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAYAAACk7+45AAAAMElEQVR4AQAkANv/AgEBAQAiIyL/Av///wBiYmIAAiMjIv98e3wBAmFiYwAAAQAAAAAA//9XhFfAAAAABklEQVQDALnzCZfeMxpZAAAAAElFTkSuQmCC)",

                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                        fontFamily: "Ubuntu Bold",

                        position: "relative"
                    }} onMouseDown={onMouseDown}>
                        Wired Furni

                        <div className="sprite_dialog_wired_close" style={{
                            position: "absolute",

                            right: 0,

                            cursor: "pointer"
                        }} onClick={onClose}/>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
