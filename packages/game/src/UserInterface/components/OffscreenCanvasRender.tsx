import { CSSProperties, RefObject, useEffect, useRef } from "react";

export type OffscreenCanvasRenderProps = {
    ref?: RefObject<HTMLCanvasElement | null>;

    scale?: number;
    style?: CSSProperties;
} & ({
    offscreenCanvas: ImageBitmap | Promise<ImageBitmap>;
    placeholderImage?: ImageBitmap;
}| {
    offscreenCanvas?: ImageBitmap | Promise<ImageBitmap>;
    placeholderImage: ImageBitmap;
});


export default function OffscreenCanvasRender({ ref, offscreenCanvas, placeholderImage, style, scale = 1 }: OffscreenCanvasRenderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        (async () => {
            const actualRef = ref ?? canvasRef;

            if(!actualRef.current) {
                return;
            }

            if(placeholderImage && actualRef.current.width === 0) {
                actualRef.current.width = placeholderImage.width
                actualRef.current.height = placeholderImage.height

                const context = actualRef.current.getContext("2d");

                if(!context) {
                    return;
                }

                context.drawImage(placeholderImage, 0, 0);
            }

            const image = (offscreenCanvas instanceof OffscreenCanvas)?(offscreenCanvas):(await offscreenCanvas);

            if(!actualRef.current || !image) {
                return;
            }

            actualRef.current.width = image.width * scale;
            actualRef.current.height = image.height * scale;

            const context = actualRef.current.getContext("2d");

            if(!context) {
                return;
            }

            context.imageSmoothingEnabled = false;

            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, actualRef.current.width, actualRef.current.height);
        })();
    }, [ref, canvasRef, offscreenCanvas, placeholderImage]);

    return (
        <canvas ref={ref ?? canvasRef} style={style} width={0} height={0}/>
    );
}
