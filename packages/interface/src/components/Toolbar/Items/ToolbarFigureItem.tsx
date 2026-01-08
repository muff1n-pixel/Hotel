import { useContext, useEffect, useRef, useState } from "react";
import ClientFigureRequest from "@shared/interfaces/requests/ClientFigureRequest";
import ClientFigureResponse from "@shared/interfaces/responses/ClientFigureResponse";
import { AppContext } from "../../../contexts/AppContext";

export default function ToolbarFigureItem() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {internalEventTarget} = useContext(AppContext);

    const [figureImage, setFigureImage] = useState<OffscreenCanvas>();

    useEffect(() => {
        internalEventTarget.addEventListener<ClientFigureResponse>("ClientFigureResponse", (event) => {
            console.log("Received ClientFigureResponse in interface");

            setFigureImage(event.image);
        });

        internalEventTarget.dispatchEvent(new ClientFigureRequest("user"));
    }, []);

    useEffect(() => {
        if(canvasRef.current && figureImage) {
            const context = canvasRef.current.getContext("2d");

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
