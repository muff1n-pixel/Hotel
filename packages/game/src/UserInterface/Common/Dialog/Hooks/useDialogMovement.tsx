import { useCallback, useEffect, useRef } from "react";
import { MousePosition } from "../Components/DialogHeader";
import useDialogMouse from "./useDialogMouse";

export default function useDialogMovement(initialPosition: MousePosition = { left: 200, top: 200 }) {
    const elementRef = useRef<HTMLDivElement>(null);
    const positionRef = useRef<MousePosition>(initialPosition);

    useEffect(() => {
        if(elementRef.current) {
            elementRef.current.style.transform = `translate(${positionRef.current.left}px, ${positionRef.current.top}px)`;
            elementRef.current.style.zIndex = Math.round(performance.now()).toString();
        }
    }, [elementRef]);

    const onDialogMove = useCallback((event: MouseEvent) => {
        const position: MousePosition = {
            left: positionRef.current.left + Math.round(event.movementX),
            top: positionRef.current.top + Math.round(event.movementY),
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

    const onDialogFocus = useCallback(() => {
        if(!elementRef.current) {
            return;
        }

        elementRef.current.style.zIndex = Math.round(performance.now()).toString();
    }, [elementRef]);

    const { onMouseDown } = useDialogMouse({ onDialogMove });

    return {
        elementRef,

        onDialogFocus,
        onMouseDown
    };
}
