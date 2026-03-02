import { RefObject, useEffect, useState } from "react";
import OffscreenCanvasRender from "../OffscreenCanvasRender";
import Furniture from "@Client/Furniture/Furniture";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import { FurnitureData } from "@pixel63/events";

export type FurnitureIconProps = {
    ref?: RefObject<HTMLCanvasElement | null>;
    furnitureData?: FurnitureData;
}

export default function FurnitureIcon({ ref, furnitureData }: FurnitureIconProps) {
    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
        if(!furnitureData) {
            return;
        }
        
        const furnitureRenderer = new Furniture(furnitureData.type, 1, 0, 0, furnitureData.color);

        furnitureRenderer.renderToCanvas().then((image) => {
            setImage(image);
        });
    }, [ furnitureData ]);

    return (
        <OffscreenCanvasRender ref={ref} offscreenCanvas={image} placeholderImage={FurnitureAssets.placeholder32.image}/>
    );
}
