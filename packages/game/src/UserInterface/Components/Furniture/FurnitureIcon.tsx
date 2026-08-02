import { RefObject, useEffect, useRef, useState } from "react";
import OffscreenCanvasRender from "../../Common/OffscreenCanvas/OffscreenCanvasRender";
import Furniture from "@Client/Furniture/Furniture";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import { FurnitureData, UserFurnitureColorTag } from "@pixel63/events";

export type FurnitureIconProps = {
    ref?: RefObject<HTMLCanvasElement | null>;
    furnitureData?: FurnitureData;
    colorTags?: UserFurnitureColorTag[];
}

export default function FurnitureIcon({ ref, furnitureData, colorTags }: FurnitureIconProps) {
    const rendering = useRef<boolean>(false);

    const [image, setImage] = useState<OffscreenCanvas>();

    useEffect(() => {
        if(!furnitureData) {
            return;
        }

        if(rendering.current) {
            return;
        }

        rendering.current = true;
        
        const furnitureRenderer = new Furniture(furnitureData.type, 1, 0, 0, furnitureData.color);

        furnitureRenderer.colorTags = colorTags;

        furnitureRenderer.renderToCanvas().then((image) => {
            rendering.current = false;

            setImage(image);
        });
    }, [ furnitureData, colorTags ]);

    return (
        <OffscreenCanvasRender ref={ref} offscreenCanvas={image} placeholderImage={FurnitureAssets.placeholder32.image}/>
    );
}
