import { CSSProperties, useEffect, useState } from "react";
import OffscreenCanvasRender from "../OffscreenCanvasRender";
import Figure from "@Client/Figure/Figure";
import { FigureConfiguration } from "@Shared/Interfaces/Figure/FigureConfiguration";

export type FigureImageProps = {
    actions?: string[];
    frame?: number;
    figureConfiguration: FigureConfiguration;
    direction: number;
    cropped?: boolean;
    headOnly?: boolean;
    style?: CSSProperties;
}

export default function FigureImage({ actions, frame = 0, headOnly, cropped = true, figureConfiguration, direction, style }: FigureImageProps) {
    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
        const furnitureRenderer = new Figure(figureConfiguration, direction, actions, headOnly);

        furnitureRenderer.renderToCanvas(Figure.figureWorker, frame, cropped).then(({ figure }) => {
            setImage(figure.image);
        });
    }, [ figureConfiguration, direction, actions, headOnly, frame, cropped ]);

    if(!image) {
        return;
    }

    return (
        <OffscreenCanvasRender offscreenCanvas={image} style={style}/>
    );
}
