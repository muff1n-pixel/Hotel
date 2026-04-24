import { CSSProperties, useEffect, useState } from "react";
import OffscreenCanvasRender from "../../Common/OffscreenCanvas/OffscreenCanvasRender";
import Figure from "@Client/Figure/Figure";
import { FigureConfigurationData } from "@pixel63/events";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";

export type FigureImageProps = {
    actions?: string[];
    frame?: number;
    figureConfiguration?: FigureConfigurationData;
    direction: number;
    cropped?: boolean;
    headOnly?: boolean;
    style?: CSSProperties;
    scale?: number;
}

export default function FigureImage({ actions, frame = 0, headOnly, cropped = true, figureConfiguration, direction, style, scale }: FigureImageProps) {
    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
        const furnitureRenderer = new Figure(figureConfiguration, direction, actions, headOnly);

        furnitureRenderer.renderToCanvas(frame, cropped).then(({ figure }) => {
            setImage(figure.image);
        });
    }, [ figureConfiguration, direction, actions, headOnly, frame, cropped ]);

    return (
        <OffscreenCanvasRender offscreenCanvas={image} style={style} placeholderImage={FurnitureAssets.placeholder32?.image} scale={scale} imageSmoothingEnabled={(scale && scale < 1)?(true):(false)}/>
    );
}
