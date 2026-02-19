import { useEffect, useState } from "react";
import OffscreenCanvasRender from "../OffscreenCanvasRender";
import Figure from "@Client/Figure/Figure";
import { FigureConfiguration } from "@Shared/Interfaces/Figure/FigureConfiguration";

export type FigureImageProps = {
    actions?: string[];
    figureConfiguration: FigureConfiguration;
    direction: number;
    cropped?: boolean;
}

export default function FigureImage({ actions, cropped = true, figureConfiguration, direction }: FigureImageProps) {
    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
        const furnitureRenderer = new Figure(figureConfiguration, direction, actions);

        furnitureRenderer.renderToCanvas(Figure.figureWorker, 0, cropped).then(({ figure }) => {
            setImage(figure.image);
        });
    }, [ figureConfiguration ]);

    if(!image) {
        return;
    }

    return (
        <OffscreenCanvasRender offscreenCanvas={image}/>
    );
}
