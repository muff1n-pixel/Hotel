import { CSSProperties, useEffect, useRef } from "react";

export type OffscreenCanvasRenderProps = {
    offscreenCanvas: OffscreenCanvas;
    scale?: number;
    style?: CSSProperties;
}

export default function OffscreenCanvasRender({ offscreenCanvas, style, scale = 1 }: OffscreenCanvasRenderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if(!canvasRef.current || !offscreenCanvas) {
            return;
        }

        canvasRef.current.width = offscreenCanvas.width * scale;
        canvasRef.current.height = offscreenCanvas.height * scale;

        const context = canvasRef.current.getContext("2d");

        if(!context) {
            return;
        }

        context.imageSmoothingEnabled = false;

        context.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, canvasRef.current.width, canvasRef.current.height);
    }, [canvasRef, offscreenCanvas]);

    return (
        <canvas ref={canvasRef} style={style}/>
    );
}
