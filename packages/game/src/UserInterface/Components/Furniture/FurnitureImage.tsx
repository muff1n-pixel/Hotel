import { useEffect, useState } from "react";
import OffscreenCanvasRender from "../../Common/OffscreenCanvas/OffscreenCanvasRender";
import Furniture from "@Client/Furniture/Furniture";
import { FigureConfigurationData, FurnitureData } from "@pixel63/events";

export type FurnitureImageProps = {
    figureConfiguration?: FigureConfigurationData;
    externalImage?: string;
    frame?: number;
    animation?: number;
    direction?: number;
    furnitureData?: FurnitureData;
    spritesWithoutInkModes?: boolean;
}

export default function FurnitureImage({ externalImage, figureConfiguration, frame = 0, direction, animation = 0, furnitureData, spritesWithoutInkModes = true }: FurnitureImageProps) {
    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
        if(!furnitureData?.type) {
            return;
        }

        const furnitureRenderer = new Furniture(furnitureData.type, 64, direction, animation, furnitureData.color);
        furnitureRenderer.frame = frame;
        furnitureRenderer.externalImage = externalImage;
        furnitureRenderer.figureConfiguration = figureConfiguration;

        furnitureRenderer.renderToCanvas({ spritesWithoutInkModes }).then((image) => {
            setImage(image);
        });
    }, [ furnitureData, animation, frame, direction, spritesWithoutInkModes, externalImage, figureConfiguration ]);

    if(!image) {
        return;
    }

    return (
        <OffscreenCanvasRender offscreenCanvas={image}/>
    );
}
