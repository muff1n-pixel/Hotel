import { CSSProperties, PropsWithChildren } from "react";
import useDialogMovement from "../../Hooks/useDialogMovement";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";

export type TraxDialogProps = PropsWithChildren & {
    hidden?: boolean;
    onClose?: () => void;
    onEditClick?: (() => void) | false;
    initialPosition?: "corner" | "center";
    style?: CSSProperties;

    title: string;

    width: number;
    height: number;
};

export default function TraxDialog({ title, children, initialPosition, width, height, hidden, onClose, style }: TraxDialogProps) {
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

    if(hidden) {
        return null;
    }

    return (
        <div ref={elementRef} onMouseDown={onDialogFocus} style={{
            display: "flex",

            position: "fixed",
            pointerEvents: "auto",

            border: "1px solid black",
            borderRadius: 8,

            fontSize: 12,

            textShadow: "rgba(255, 255, 255, .5) 0 0 1px"
        }}>
            <div style={{
                flex: 1,

                border: "1px solid #AEB5BB",
                borderBottomColor: "#445B63",
                borderRightColor: "#445B63",
                borderRadius: 7,

                display: "flex",
            }}>
                <div style={{
                    flex: 1,

                    border: "1px solid #445B63",
                    borderRadius: 6,

                    background: "#587580",

                    display: "flex",
                    flexDirection: "column",

                    width: width,
                    height: height,

                    padding: 2,

                    gap: 5
                }}>
                    <div style={{
                        height: 17,

                        backgroundImage: "linear-gradient(45deg, #354A4D, #354A4D 50%, #587580 50%, #587580)",
                        backgroundSize: "2px 2px",

                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                        fontFamily: "Ubuntu Bold",

                        position: "relative"
                    }} onMouseDown={onMouseDown}>
                        <div style={{
                            backgroundColor: "#587580",

                            padding: "2px 10px",
                        }}>
                            {title}
                        </div>

                        <div className="sprite_dialog_trax_close" style={{
                            position: "absolute",
                            right: 2,
                            cursor: "pointer"
                        }} onClick={onClose}/>
                    </div>

                    <div style={{
                        flex: 1,

                        padding: "6px 12px",

                        ...style
                    }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
