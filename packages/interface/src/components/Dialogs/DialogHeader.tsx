import { useCallback, useEffect, useState } from "react";
import { MouseEventHandler } from "react";

export type MousePosition = {
    left: number;
    top: number;
};

export type DialogHeaderProps = {
    title: string;
    onDialogMove: (event: MouseEvent) => void;
};

export default function DialogHeader({ title, onDialogMove }: DialogHeaderProps) {
    const [mouseDown, setMouseDown] = useState<boolean>();
    
    useEffect(() => {
        if(mouseDown) {
            const mouseMoveListener = (event: MouseEvent) => {
                onDialogMove(event);
            };

            const mouseUpListener = () => {
                setMouseDown(false);
            };

            document.addEventListener("mousemove", mouseMoveListener);
            document.addEventListener("mouseup", mouseUpListener);
            document.addEventListener("mouseleave", mouseUpListener);

            return () => {
                document.removeEventListener("mousemove", mouseMoveListener);
                document.removeEventListener("mouseup", mouseUpListener);
                document.removeEventListener("mouseleave", mouseUpListener);
            };
        }
    }, [mouseDown]);

    const onMouseDown = useCallback<MouseEventHandler<HTMLElement>>((event) => {
        setMouseDown(true);
    }, []);

    return (
        <div style={{
            backgroundColor: "#367897",
            
            width: "100%",
            height: 31,

            border: "2px solid rgba(255, 255, 255, .14)",
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,

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
                right: 6,
                top: 4
            }}>
                <div className="sprite_dialog_close" style={{
                    cursor: "pointer"
                }}/>
            </div>
        </div>
    );
}
