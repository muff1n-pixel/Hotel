import { useContext, useEffect, useRef, useState } from "react";
import ClientFigureResponse from "@Shared/events/responses/ClientFigureResponse";
import { AppContext } from "../../../contexts/AppContext";
import ClientFigureRequest from "@Shared/events/requests/ClientFigureRequest";

export default function ToolbarFigureItem() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { user, internalEventTarget } = useContext(AppContext);

    const [figureImage, setFigureImage] = useState<ImageBitmap>();

    useEffect(() => {
        if(!user) {
            return;
        }

        const requestEvent = new ClientFigureRequest(user.figureConfiguration, 2);

        const listener = (event: ClientFigureResponse) => {
            if(event.id !== requestEvent.id) {
                return;
            }

            setFigureImage(event.image);
        };

        internalEventTarget.addEventListener("ClientFigureResponse", listener);

        internalEventTarget.dispatchEvent(requestEvent);

        return () => {
            internalEventTarget.removeEventListener("ClientFigureResponse", listener);
        };
    }, [user]);

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
