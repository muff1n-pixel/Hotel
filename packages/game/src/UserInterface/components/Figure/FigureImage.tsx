import { useEffect, useState } from "react";
import OffscreenCanvasRender from "../OffscreenCanvasRender";
import { FurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import Furniture from "@Client/Furniture/Furniture";
import { FigureConfiguration } from "@Shared/Interfaces/Figure/FigureConfiguration";
import Figure from "@Client/Figure/Figure";

export type FigureImageProps = {
    figureConfiguration: FigureConfiguration;
    direction: number;
}

export default function FigureImage({ figureConfiguration, direction }: FigureImageProps) {
    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
        const furnitureRenderer = new Figure(figureConfiguration, direction);

        furnitureRenderer.renderToCanvas(Figure.figureWorker, 0, true).then(({ image }) => {
            setImage(image);
        });
    }, [ figureConfiguration ]);

    if(!image) {
        return;
    }

    return (
        <OffscreenCanvasRender offscreenCanvas={image}/>
    );
}
