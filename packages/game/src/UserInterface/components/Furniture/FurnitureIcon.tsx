import { RefObject, useEffect, useState } from "react";
import OffscreenCanvasRender from "../OffscreenCanvasRender";
import { FurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import Furniture from "@Client/Furniture/Furniture";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";

export type FurnitureIconProps = {
    ref?: RefObject<HTMLCanvasElement | null>;
    furnitureData: FurnitureData;
}

export default function FurnitureIcon({ ref, furnitureData }: FurnitureIconProps) {
    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
        const furnitureRenderer = new Furniture(furnitureData.type, 1, 0, 0, furnitureData.color);

        furnitureRenderer.renderToCanvas().then((image) => {
            setImage(image);
        });
    }, [ furnitureData ]);

    return (
        <OffscreenCanvasRender ref={ref} offscreenCanvas={image} placeholderImage={FurnitureAssets.placeholder32.image}/>
    );
}
