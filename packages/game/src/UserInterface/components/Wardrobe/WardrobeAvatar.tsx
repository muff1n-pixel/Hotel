import { useEffect, useState } from "react";
import OffscreenCanvasRender from "../OffscreenCanvasRender";
import Figure from "@Client/Figure/Figure";
import { defaultFigureWorkerClient } from "@Client/Figure/Worker/FigureWorkerClient";
import { FigureConfigurationData } from "@pixel63/events";

export type WardrobeAvatarProps = {
    configuration: FigureConfigurationData;
};

export default function WardrobeAvatar({ configuration }: WardrobeAvatarProps) {
    const [figureImage, setFigureImage] = useState<ImageBitmap>();

    useEffect(() => {
        const figureRenderer = new Figure(configuration, 4);
        
        figureRenderer.renderToCanvas(defaultFigureWorkerClient, 0, false).then(({ figure }) => {
            setFigureImage(figure.image);
        });
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
            {(figureImage) && (<OffscreenCanvasRender offscreenCanvas={figureImage} scale={2}/>)}
        </div>
    );
}
