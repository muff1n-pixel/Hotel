import { RoomCameraOptions } from "@UserInterface/Components/Room/Camera/RoomCameraEditorDialog";
import { useEffect, useRef, useState } from "react";

export type RoomCameraEditorRendererProps = {
    size: number;
    image: string;
    options: RoomCameraOptions;
}

export default function RoomCameraEditorRenderer({ size, image: imageSource, options }: RoomCameraEditorRendererProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const [image, setImage] = useState<HTMLImageElement>();

    useEffect(() => {
        const image = new Image();

        image.onload = () => setImage(image);

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

        context.clearRect(0, 0, 320, 320);

        const filters: string[] = [];

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

            context.drawImage(image, 80, 80, 160, 160, 0, 0, 320, 320);
            
            context.imageSmoothingEnabled = true;
        }
        else {
            context.drawImage(image, 0, 0);
        }
        
        outputContext.drawImage(offscreenCanvas, 0, 0, 320, 320, 0, 0, size, size);
    }, [image, options, size]);

    return (
        <canvas ref={canvasRef} width={size} height={size}/>
    );
}