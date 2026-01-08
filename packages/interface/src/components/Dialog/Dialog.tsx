import { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import DialogHeader, { MousePosition } from "./DialogHeader";

export default function Dialog() {
    const elementRef = useRef<HTMLDivElement>(null);
    const positionRef = useRef<MousePosition>({
        left: 0,
        top: 0
    });

    const onDialogMove = useCallback((event: MouseEvent) => {
        const position: MousePosition = {
            left: positionRef.current.left + event.movementX,
            top: positionRef.current.top + event.movementY,
        };

        if(position.left < 0) {
            position.left = 0;
        }

        if(position.top < 0) {
            position.top = 0;
        }

        const maximumLeft = (document.body.clientWidth - elementRef.current!.clientWidth); 

        if(position.left > maximumLeft) {
            position.left = maximumLeft;
        }
        
        const maximumTop = (document.body.clientHeight - elementRef.current!.clientHeight); 
        
        if(position.top > maximumTop) {
            position.top = maximumTop;
        }

        positionRef.current = position;
        
        elementRef.current!.style.transform = `translate(${positionRef.current.left}px, ${positionRef.current.top}px)`;

        // TODO: pass down the new position to re-align the mouse start position to avoid offsets when hitting the document edges
    }, []);

    return (
        <div ref={elementRef} style={{
            border: "1px solid black",
            borderRadius: 7,

            backgroundColor: "#ECEAE0",

            width: 500,
            height: 400,

            left: 0,
            top: 0,

            overflow: "hidden",

            position: "fixed",

            display: "flex",
            flexDirection: "column",

            pointerEvents: "auto"
        }}>
            <DialogHeader title="Change Your Looks" onDialogMove={onDialogMove}/>

            <div style={{
                height: 1,
                width: "100%",
                backgroundColor: "black"
            }}/>

            <div style={{
                flex: 1,

                border: "2px solid white",
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
                borderTop: "none"
            }}>

            </div>
        </div>
    );
}
