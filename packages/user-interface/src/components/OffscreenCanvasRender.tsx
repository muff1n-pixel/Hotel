import { CSSProperties, useEffect, useRef } from "react";

export type OffscreenCanvasRenderProps = {
    offscreenCanvas: ImageBitmap | Promise<ImageBitmap>;
    scale?: number;
    style?: CSSProperties;
}

export default function OffscreenCanvasRender({ offscreenCanvas, style, scale = 1 }: OffscreenCanvasRenderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        (async () => {
            if(!canvasRef.current || !offscreenCanvas) {
                return;
            }

            const image = (offscreenCanvas instanceof OffscreenCanvas)?(offscreenCanvas):(await offscreenCanvas);

            if(!canvasRef.current || !image) {
                return;
            }

            canvasRef.current.width = image.width * scale;
            canvasRef.current.height = image.height * scale;

            const context = canvasRef.current.getContext("2d");

            if(!context) {
                return;
            }

            context.imageSmoothingEnabled = false;

            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasRef.current.width, canvasRef.current.height);
        })();
    }, [canvasRef, offscreenCanvas]);

    return (
        <canvas ref={canvasRef} style={style} width={0} height={0}/>
    );
}
