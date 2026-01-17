import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import ClientFigureRequest from "@Shared/events/requests/ClientFigureRequest";
import ClientFigureResponse from "@Shared/events/responses/ClientFigureResponse";
import OffscreenCanvasRender from "../OffscreenCanvasRender";
import { FigureConfiguration } from "@Shared/Interfaces/figure/FigureConfiguration";

export type WardrobeAvatarProps = {
    configuration: FigureConfiguration;
};

export default function WardrobeAvatar({ configuration }: WardrobeAvatarProps) {
    const { internalEventTarget } = useContext(AppContext);

    const [figureImage, setFigureImage] = useState<ImageBitmap>();

    useEffect(() => {
        const requestEvent = new ClientFigureRequest(configuration, 4);

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
