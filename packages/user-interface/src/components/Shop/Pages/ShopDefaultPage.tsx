import { useContext, useEffect, useRef, useState } from "react";
import DialogPanel from "../../Dialog/Panels/DialogPanel";
import { ShopPageProps } from "./ShopPage";
import { AppContext } from "../../../contexts/AppContext";
import { ShopPageFurnitureRequest } from "@shared/WebSocket/Events/Shop/ShopPageFurnitureRequest";
import { ShopPageFurnitureData, ShopPageFurnitureResponse } from "@shared/WebSocket/Events/Shop/ShopPageFurnitureResponse";
import WebSocketEvent from "@shared/WebSocket/Events/WebSocketEvent";
import FurnitureIcon from "../../Furniture/FurnitureIcon";
import StartRoomRenderer from "@shared/Events/Room/Renderer/StartRoomRenderer";
import RoomRendererStarted from "@shared/Events/Room/Renderer/RoomRendererStarted";
import SetRoomRendererFurniture from "@shared/Events/Room/Renderer/SetRoomRendererFurniture";
import TerminateRoomRenderer from "@shared/Events/Room/Renderer/TerminateRoomRenderer";

export default function ShopDefaultPage({ page }: ShopPageProps) {
    const { internalEventTarget, webSocketClient } = useContext(AppContext);

    const roomRef = useRef<HTMLDivElement>(null);
    const roomRendererRequested = useRef<boolean>(false);
    const [roomRendererStarted, setRoomRendererStarted] = useState<boolean>(false);
    
    const [activeFurniture, setActiveFurniture] = useState<ShopPageFurnitureData>();
    const [shopFurnitures, setShopFurnitures] = useState<ShopPageFurnitureData[]>([]);
    const shopFurnituresRequested = useRef<boolean>(false);

    useEffect(() => {
        if(shopFurnituresRequested.current) {
            return;
        }

        shopFurnituresRequested.current = true;

        const listener = (event: WebSocketEvent<ShopPageFurnitureResponse>) => {
            if(event.data.pageId === page.id) {
                setShopFurnitures(event.data.furniture);
            }
        }

        webSocketClient.addEventListener<WebSocketEvent<ShopPageFurnitureResponse>>("ShopPageFurnitureResponse", listener, {
            once: true
        });

        webSocketClient.send<ShopPageFurnitureRequest>("ShopPageFurnitureRequest", {
            pageId: page.id
        });
    }, []);

    useEffect(() => {
        if(!roomRef.current) {
            return;
        }

        if(roomRendererRequested.current) {
            return;
        }

        roomRendererRequested.current = true;

        const requestEvent = new StartRoomRenderer(roomRef.current);

        const listener = (event: RoomRendererStarted) => {
            if(event.id !== requestEvent.id) {
                return;
            }

            setRoomRendererStarted(true);
        };

        internalEventTarget.addEventListener("RoomRendererStarted", listener, {
            once: true
        });

        internalEventTarget.dispatchEvent(requestEvent);
    }, [roomRef]);

    useEffect(() => {
        if(!roomRendererRequested || !activeFurniture) {
            return;
        }

        internalEventTarget.dispatchEvent(new SetRoomRendererFurniture(activeFurniture.type, 64, 2));
    }, [roomRendererStarted, activeFurniture]);

    useEffect(() => {
        if(!roomRendererStarted) {
            return;
        }

        return () => {
            internalEventTarget.dispatchEvent(new TerminateRoomRenderer());
        };
    }, [roomRendererStarted]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",

            gap: 10
        }}>
            <div ref={roomRef} style={{
                background: "#000",
                height: 240,
                width: "100%"
            }}/>

            <DialogPanel style={{ flex: 1 }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    padding: 4
                }}>
                    {shopFurnitures.map((furniture) => (
                        <div key={furniture.id} style={{
                            width: 53,
                            height: 62,
                            boxSizing: "border-box",

                            borderRadius: 5,

                            border: (activeFurniture?.id === furniture.id)?("2px solid #62C4E8"):(undefined),
                            background: (activeFurniture?.id === furniture.id)?("#FFFFFF"):(undefined),

                            display: "flex",
                            justifyContent: "center",

                            cursor: "pointer"
                        }} onClick={() => setActiveFurniture(furniture)}>
                            <div style={{
                                alignSelf: "center",
                                justifySelf: "center"
                            }}>
                                <FurnitureIcon type={furniture.type}/>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogPanel>

            <div style={{
                height: 52
            }}>

            </div>
        </div>
    );
}
