import { useEffect, useState } from "react";
import OffscreenCanvasRender from "../OffscreenCanvasRender";
import { FurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import Furniture from "@Client/Furniture/Furniture";

export type FurnitureImageProps = {
    furnitureData: FurnitureData;
}

export default function FurnitureImage({ furnitureData }: FurnitureImageProps) {
    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
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
