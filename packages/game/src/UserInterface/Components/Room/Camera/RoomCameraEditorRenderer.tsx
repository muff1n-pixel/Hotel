import AssetFetcher from "@Client/Assets/AssetFetcher";
import { RoomCameraOptions } from "@UserInterface/Components/Room/Camera/RoomCameraEditorDialog";
import { RefObject, useEffect, useRef, useState } from "react";

export type RoomCameraEditorRendererProps = {
    canvasRef?: RefObject<HTMLCanvasElement | null>;
    size: number;
    image: string;
    options: RoomCameraOptions;
    onDataUrlChanged?: (dataUrl: string) => void;
}

export default function RoomCameraEditorRenderer({ canvasRef = useRef<HTMLCanvasElement>(null), size, image: imageSource, options, onDataUrlChanged }: RoomCameraEditorRendererProps) {    
    const [image, setImage] = useState<HTMLImageElement>();
    const [imageData, setImageData] = useState<ImageData>();

    useEffect(() => {
        const image = new Image();

        image.onload = () => {
            const canvas = new OffscreenCanvas(320, 320);
            const context = canvas.getContext("2d");

            if(!context) {
                return;
            }

            context.drawImage(image, 0, 0);

            setImageData(context.getImageData(0, 0, 320, 320));
            setImage(image);
        };

        image.src = imageSource;
    }, [imageSource]);

    useEffect(() => {
        const offscreenCanvas = new OffscreenCanvas(320, 320);
        const context = offscreenCanvas.getContext("2d");

        const outputContext = canvasRef.current?.getContext("2d");

        if(!context || !outputContext) {
            return;
        }

        if(!image) {
            return;
        }

        if(!imageData) {
            return;
        }

        (async () => {
            context.clearRect(0, 0, 320, 320);

            const filters: string[] = [];

            const mutatedImageData = new ImageData(new Uint8ClampedArray(imageData.data), 320, 320);

            if(options.filters?.pale) {
                for (let i = 0; i < mutatedImageData.data.length; i += 4) {
                    let r = mutatedImageData.data[i];
                    let g = mutatedImageData.data[i + 1];
                    let b = mutatedImageData.data[i + 2];

                    // Convert to grayscale (luminance)
                    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

                    // Blend original color with grayscale (desaturate)
                    const amount = options.filters.pale / 100;
                    r = r * (1 - amount) + gray * amount;
                    g = g * (1 - amount) + gray * amount;
                    b = b * (1 - amount) + gray * amount;

                    // Lift brightness slightly
                    const lift = 20;
                    mutatedImageData.data[i]     = Math.min(255, r + lift);
                    mutatedImageData.data[i + 1] = Math.min(255, g + lift);
                    mutatedImageData.data[i + 2] = Math.min(255, b + lift);
                }
            }

            context.putImageData(mutatedImageData, 0, 0);

            if(options.filters?.sepia) {
                filters.push(`sepia(${options.filters.sepia}%)`);
            }

            if(options.filters?.saturation) {
                filters.push(`saturate(${100 + options.filters.saturation}%)`);
            }

            if(options.filters?.contrast) {
                filters.push(`contrast(${100 + options.filters.contrast}%)`);
            }

            context.filter = filters.join(' ');

            if(options.zoomed) {
                context.imageSmoothingEnabled = false;

                context.drawImage(offscreenCanvas, 80, 80, 160, 160, 0, 0, 320, 320);
                
                context.imageSmoothingEnabled = true;
            }
            else {
                context.drawImage(offscreenCanvas, 0, 0);
            }

            context.filter = "";

            for(const [name, value] of Object.entries(options.frames ?? {})) {
                const image = await AssetFetcher.fetchImage(`/assets/room/photos/frames/${name}.png`);

                context.globalAlpha = (value ?? 0) / 100;

                if(name.endsWith("_hrd")) {
                    context.globalCompositeOperation = "color-burn";
                }
                else if(name.endsWith("_mpl") || name.includes("multiply")) {
                    context.globalCompositeOperation = "multiply";
                }
                else if(name.includes("hardlight")) {
                    context.globalCompositeOperation = "hard-light";
                }
                else if(name.includes("overlay")) {
                    context.globalCompositeOperation = "overlay";
                }
                else {
                    context.globalCompositeOperation = "source-over";
                }

                context.drawImage(image, 0, 0);
            }
            
            outputContext.drawImage(offscreenCanvas, 0, 0, 320, 320, 0, 0, size, size);

            onDataUrlChanged?.(outputContext.canvas.toDataURL("image/png"));
        })();
    }, [image, imageData, options, size, onDataUrlChanged]);

    return (
        <canvas ref={canvasRef} width={size} height={size}/>
    );
}