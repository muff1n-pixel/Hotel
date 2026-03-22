import { useEffect, useState } from "react";
import OffscreenCanvasRender from "../../Common/OffscreenCanvas/OffscreenCanvasRender";
import Furniture from "@Client/Furniture/Furniture";
import { FurnitureData } from "@pixel63/events";

export type FurnitureImageProps = {
    frame?: number;
    animation?: number;
    furnitureData?: FurnitureData;
}

export default function FurnitureImage({ frame = 0, animation = 0, furnitureData }: FurnitureImageProps) {
    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
        if(!furnitureData?.type) {
            return;
        }

        const furnitureRenderer = new Furniture(furnitureData.type, 64, undefined, animation, furnitureData.color);
        furnitureRenderer.frame = frame;

        furnitureRenderer.renderToCanvas({ spritesWithoutInkModes: true }).then((image) => {
            setImage(image);
        });
    }, [ furnitureData, animation, frame ]);

    if(!image) {
        return;
    }

    return (
        <OffscreenCanvasRender offscreenCanvas={image}/>
    );
}
