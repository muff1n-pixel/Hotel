import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import ClientFigureRequest from "@shared/interfaces/requests/ClientFigureRequest";
import ClientFigureResponse from "@shared/interfaces/responses/ClientFigureResponse";
import OffscreenCanvasRender from "../OffscreenCanvasRender";

export default function WardrobeAvatar() {
    const { internalEventTarget } = useContext(AppContext);

    const [figureImage, setFigureImage] = useState<OffscreenCanvas>();

    useEffect(() => {
        const requestEvent = new ClientFigureRequest("user", 4);

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
    }, []);

    return (
        <div style={{
            width: "100%",
            height: 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            overflow: "hidden"
        }}>
            {(figureImage) && (<OffscreenCanvasRender offscreenCanvas={figureImage} scale={2} style={{
            }}/>)}
        </div>
    );
}
