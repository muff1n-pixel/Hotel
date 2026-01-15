import { useContext, useEffect, useState } from "react";
import OffscreenCanvasRender from "../OffscreenCanvasRender";
import ClientFurnitureRequest from "@shared/Events/Furniture/ClientFurnitureRequest";
import ClientFurnitureResponse from "@shared/Events/Furniture/ClientFurnitureResponse";
import { AppContext } from "../../contexts/AppContext";
import { FurnitureData } from "@shared/Interfaces/Room/RoomFurnitureData";

export type FurnitureIconProps = {
    furnitureData: FurnitureData;
}

export default function FurnitureIcon({ furnitureData }: FurnitureIconProps) {
    const { internalEventTarget } = useContext(AppContext);

    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
        const requestEvent = new ClientFurnitureRequest(furnitureData.type, 1, 0, 0, furnitureData.color);

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
    }, [ furnitureData ]);

    if(!image) {
        return;
    }

    return (
        <OffscreenCanvasRender offscreenCanvas={image}/>
    );
}
