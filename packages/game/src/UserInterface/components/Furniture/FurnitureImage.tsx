import { useEffect, useState } from "react";
import OffscreenCanvasRender from "../OffscreenCanvasRender";
import Furniture from "@Client/Furniture/Furniture";
import { FurnitureData } from "@pixel63/events";

export type FurnitureImageProps = {
    furnitureData?: FurnitureData;
}

export default function FurnitureImage({ furnitureData }: FurnitureImageProps) {
    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
        if(!furnitureData) {
            return;
        }

        const furnitureRenderer = new Furniture(furnitureData.type, 64, undefined, 0, furnitureData.color);

        furnitureRenderer.renderToCanvas({ spritesWithoutInkModes: true }).then((image) => {
            setImage(image);
        });
    }, [ furnitureData ]);

    if(!image) {
        return;
    }

    return (
        <OffscreenCanvasRender offscreenCanvas={image}/>
    );
}
