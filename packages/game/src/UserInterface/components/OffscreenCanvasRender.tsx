import { CSSProperties, useEffect, useRef } from "react";

export type OffscreenCanvasRenderProps = {
    scale?: number;
    style?: CSSProperties;
} & ({
    offscreenCanvas: ImageBitmap | Promise<ImageBitmap>;
    placeholderImage?: ImageBitmap;
}| {
    offscreenCanvas?: ImageBitmap | Promise<ImageBitmap>;
    placeholderImage: ImageBitmap;
});


export default function OffscreenCanvasRender({ offscreenCanvas, placeholderImage, style, scale = 1 }: OffscreenCanvasRenderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        (async () => {
            if(!canvasRef.current) {
                return;
            }

            if(placeholderImage && canvasRef.current.width === 0) {
                canvasRef.current.width = placeholderImage.width
                canvasRef.current.height = placeholderImage.height

                const context = canvasRef.current.getContext("2d");

                if(!context) {
                    return;
                }

                context.drawImage(placeholderImage, 0, 0);
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
    }, [canvasRef, offscreenCanvas, placeholderImage]);

    return (
        <canvas ref={canvasRef} style={style} width={0} height={0}/>
    );
}
