import { useCallback, useContext, useEffect, useRef, useState } from "react";
import DialogPanel from "../../Dialog/Panels/DialogPanel";
import { ShopPageProps } from "./ShopPage";
import { AppContext } from "../../../contexts/AppContext";
import { ShopPageFurnitureRequest } from "@shared/WebSocket/Events/Shop/ShopPageFurnitureRequest";
import { ShopPageFurnitureData, ShopPageFurnitureResponse } from "@shared/WebSocket/Events/Shop/ShopPageFurnitureResponse";
import WebSocketEvent from "@shared/WebSocket/Events/WebSocketEvent";
import FurnitureIcon from "../../Furniture/FurnitureIcon";
import CreateRoomRendererEvent, { RoomRendererResult } from "@shared/Events/Room/Renderer/CreateRoomRendererEvent";
import DialogButton from "../../Dialog/Button/DialogButton";
import { PurchaseShopFurnitureRequest, PurchaseShopFurnitureResponse } from "@shared/WebSocket/Events/Shop/Furniture/PurchaseShopFurniture";

export default function ShopDefaultPage({ page }: ShopPageProps) {
    const { internalEventTarget, webSocketClient } = useContext(AppContext);

    const roomRef = useRef<HTMLDivElement>(null);
    const roomRendererRequested = useRef<boolean>(false);

    const [roomRendererResult, setRoomRendererResult] = useState<RoomRendererResult>();
    
    const [activeFurniture, setActiveFurniture] = useState<ShopPageFurnitureData>();
    const [shopFurnitures, setShopFurnitures] = useState<ShopPageFurnitureData[]>([]);
    const shopFurnituresRequested = useRef<string>("");

    useEffect(() => {
        if(shopFurnituresRequested.current === page.id) {
            return;
        }

        shopFurnituresRequested.current = page.id;

        setActiveFurniture(undefined);
        setShopFurnitures([]);

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
    }, [page]);

    useEffect(() => {
        if(!roomRef.current) {
            return;
        }

        if(roomRendererRequested.current) {
            return;
        }

        roomRendererRequested.current = true;

        const requestEvent = new CreateRoomRendererEvent(roomRef.current, {}, (roomRendererResult) => {
            setRoomRendererResult(roomRendererResult);
        });

        internalEventTarget.dispatchEvent(requestEvent);
    }, [roomRef]);

    useEffect(() => {
        if(!roomRendererResult || !activeFurniture) {
            return;
        }

        roomRendererResult.setFurniture(activeFurniture.furniture.type, 64, undefined, 0, activeFurniture.furniture.color ?? 0);
    }, [roomRendererResult, activeFurniture]);

    useEffect(() => {
        if(!roomRendererResult) {
            return;
        }

        return () => {
            roomRendererResult.terminate();
        };
    }, [roomRendererResult]);

    const onRoomRendererClick = useCallback(() => {
        roomRendererResult?.progressFurnitureAnimation();
    }, [roomRendererResult]);

    const handlePurchaseFurniture = useCallback(() => {
        if(!activeFurniture) {
            return;
        }

        // TODO: disable dialog

        const listener = (event: WebSocketEvent<PurchaseShopFurnitureResponse>) => {
            // TODO: handle error
            if(!event.data.success) {

            }
        };

        webSocketClient.addEventListener<WebSocketEvent<PurchaseShopFurnitureResponse>>("PurchaseShopFurnitureResponse", listener, {
            once: true
        });

        webSocketClient.send<PurchaseShopFurnitureRequest>("PurchaseShopFurnitureRequest", {
            shopFurnitureId: activeFurniture.id
        });
    }, [activeFurniture]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",

            gap: 10,

            overflow: "hidden"
        }}>
            <div onClick={onRoomRendererClick} style={{
                background: "#000",

                height: 240,
                width: "100%",

                cursor: "pointer",

                position: "relative"
            }}>
                <div ref={roomRef} style={{
                    height: "100%",
                    width: "100%",
                }}/>

                {(activeFurniture) && (
                    <div style={{
                        position: "absolute",
                        left: 0,
                        top: 0,

                        padding: 10,

                        color: "white"
                    }}>
                        <b>{activeFurniture.furniture.name}</b>

                        {(activeFurniture.furniture.description) && (
                            <p style={{ fontSize: 12 }}>{activeFurniture.furniture.description}</p>
                        )}
                    </div>
                )}
            </div>

            <DialogPanel style={{ flex: "1 1 0", overflow: "hidden" }} contentStyle={{ display: "flex", flex: 1 }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    
                    padding: 4,
                    overflowY: "scroll"
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
                                <FurnitureIcon furnitureData={furniture.furniture}/>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogPanel>

            <div style={{
                //height: 52,

                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{ flex: 1 }}/>
                
                <div style={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <div style={{ flex: 1 }}/>

                    <DialogButton disabled={!activeFurniture} style={{ flex: 1 }} onClick={handlePurchaseFurniture}>Add to inventory</DialogButton>
                </div>
            </div>
        </div>
    );
}
