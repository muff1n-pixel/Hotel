import { useEffect, useRef, useState } from "react";
import Figure from "@Client/Figure/Figure";
import { useUser } from "../../../hooks/useUser";
import { defaultFigureWorkerClient } from "@Client/Figure/Worker/FigureWorkerClient";

export default function ToolbarFigureItem() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const user = useUser();

    const [figureImage, setFigureImage] = useState<ImageBitmap>();

    useEffect(() => {
        if(!user.figureConfiguration) {
            return;
        }

        const figureRenderer = new Figure(user.figureConfiguration, 2);

        figureRenderer.renderToCanvas(defaultFigureWorkerClient, 0).then(({ figure }) => {
            setFigureImage(figure.image);
        });
    }, [user]);

    useEffect(() => {
        if(canvasRef.current && figureImage) {
            const context = canvasRef.current.getContext("2d");

            context?.resetTransform();

            context?.translate(20, 22);
            context?.drawImage(figureImage, -128, -96 - 12);
        }
    }, [canvasRef, figureImage]);

    return (
        <div style={{
            height: 40,
            width: 44,

            overflow: "hidden"
        }}>
            <canvas ref={canvasRef} width={40} height={44}/>
        </div>
    );
}
