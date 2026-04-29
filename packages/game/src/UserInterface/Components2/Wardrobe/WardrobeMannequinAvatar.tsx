import { useEffect, useState } from "react";
import OffscreenCanvasRender from "../../Common/OffscreenCanvas/OffscreenCanvasRender";
import { FigureConfigurationData, FurnitureData } from "@pixel63/events";
import Furniture from "@Client/Furniture/Furniture";

export type WardrobeMannequinAvatarProps = {
    furnitureData: FurnitureData;
    configuration: FigureConfigurationData;
};

export default function WardrobeMannequinAvatar({ configuration, furnitureData }: WardrobeMannequinAvatarProps) {
    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
        const furniture = new Furniture(furnitureData.type, 64, 4, 0);
        
        furniture.figureConfiguration = configuration;

        furniture.renderToCanvas().then((image) => setImage(image));
    }, [ configuration ]);

    return (
        <div style={{
            width: "100%",
            height: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            overflow: "hidden"
        }}>
            {(image) && (<OffscreenCanvasRender offscreenCanvas={image}/>)}
        </div>
    );
}
