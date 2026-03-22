import { MouseEventHandler, useCallback, useEffect, useState } from "react";

export type UseDialogMouseProps = {
    onDialogMove: (event: MouseEvent) => void;
}

export default function useDialogMouse({ onDialogMove }: UseDialogMouseProps) {
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

    const onMouseDown = useCallback<MouseEventHandler<HTMLDivElement>>(() => {
        setMouseDown(true);
    }, []);

    return {
        onMouseDown
    };
}
