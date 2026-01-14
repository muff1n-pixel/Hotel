import { useContext, useEffect, useState } from "react";
import OffscreenCanvasRender from "../OffscreenCanvasRender";
import ClientFurnitureRequest from "@shared/Events/Furniture/ClientFurnitureRequest";
import ClientFurnitureResponse from "@shared/Events/Furniture/ClientFurnitureResponse";
import { AppContext } from "../../contexts/AppContext";

export type FurnitureIconProps = {
    type: string;
}

export default function FurnitureIcon({ type }: FurnitureIconProps) {
    const { internalEventTarget } = useContext(AppContext);

    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
        const requestEvent = new ClientFurnitureRequest(type, 1, 0);

        const listener = (event: ClientFurnitureResponse) => {
            if(event.id !== requestEvent.id) {
                return;
            }

            setImage(event.image);
        };

        internalEventTarget.addEventListener("ClientFurnitureResponse", listener);

        internalEventTarget.dispatchEvent(requestEvent);

        return () => {
            internalEventTarget.removeEventListener("ClientFurnitureResponse", listener);
        };
    }, [ type ]);

    if(!image) {
        return;
    }

    return (
        <OffscreenCanvasRender offscreenCanvas={image}/>
    );
}
