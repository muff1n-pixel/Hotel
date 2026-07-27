import { CSSProperties, useEffect, useRef, useState } from "react";
import OffscreenCanvasRender from "../../Common/OffscreenCanvas/OffscreenCanvasRender";
import Furniture from "@Client/Furniture/Furniture";
import { FigureConfigurationData, FurnitureData } from "@pixel63/events";
import DataStats from "@Client/DataStats";

export type FurnitureImageProps = {
    figureConfiguration?: FigureConfigurationData;
    externalImage?: string;
    frame?: number;
    animation?: number;
    direction?: number;
    furnitureData?: FurnitureData;
    spritesWithoutInkModes?: boolean;
    style?: CSSProperties;
}

export default function FurnitureImage({ externalImage, figureConfiguration, frame = 0, direction, animation = 0, furnitureData, spritesWithoutInkModes = true, style }: FurnitureImageProps) {
    const rendering = useRef<boolean>(false);

    const [image, setImage] = useState<OffscreenCanvas>();

    useEffect(() => {
        if(!furnitureData?.type) {
            return;
        }

        if(rendering.current) {
            return;
        }

        rendering.current = true;

        const furnitureRenderer = new Furniture(furnitureData.type, 64, direction, animation, furnitureData.color);
        furnitureRenderer.frame = frame;
        furnitureRenderer.externalImage = externalImage;
        furnitureRenderer.figureConfiguration = figureConfiguration;

        furnitureRenderer.renderToCanvas({ spritesWithoutInkModes }).then((image) => {
            rendering.current = false;

            setImage(image);
        });
    }, [ furnitureData, animation, frame, direction, spritesWithoutInkModes, externalImage, figureConfiguration ]);

    if(!image) {
        return;
    }

    return (
        <OffscreenCanvasRender offscreenCanvas={image} style={style}/>
    );
}
