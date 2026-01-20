import { useCallback, useContext, useEffect, useRef, useState } from "react";
import DialogPanel from "../../Dialog/Panels/DialogPanel";
import { ShopPageProps } from "./ShopPage";
import { AppContext } from "../../../contexts/AppContext";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import FurnitureIcon from "../../Furniture/FurnitureIcon";
import DialogButton from "../../Dialog/Button/DialogButton";
import RoomFurnitureRenderer from "@Client/Room/RoomFurnitureRenderer";
import { webSocketClient } from "../../../..";
import { ShopPageFurnitureData, ShopPageFurnitureEventData } from "@Shared/Communications/Responses/Shop/ShopPageFurnitureEventData";
import { GetShopPageFurnitureEventData } from "@Shared/Communications/Requests/Shop/GetShopPageFurnitureEventData";
import { PurchaseShopFurnitureEventData } from "@Shared/Communications/Requests/Shop/PurchaseShopFurnitureEventData";
import { ShopFurniturePurchasedEventData } from "@Shared/Communications/Responses/Shop/ShopFurniturePurchasedEventData";
import useShopPageFurniture from "./Hooks/useShopPageFurniture";

export default function ShopDefaultPage({ page }: ShopPageProps) {
    const roomRef = useRef<HTMLDivElement>(null);
    const roomRendererRequested = useRef<boolean>(false);

    const [roomRenderer, setRoomRenderer] = useState<RoomFurnitureRenderer>();
    
    const [activeFurniture, setActiveFurniture] = useState<ShopPageFurnitureData>();

    const shopFurniture = useShopPageFurniture(page.id);

    useEffect(() => {
        setActiveFurniture(shopFurniture[0]);
    }, [shopFurniture]);

    useEffect(() => {
        if(!roomRef.current) {
            return;
        }

        if(roomRendererRequested.current) {
            return;
        }

        roomRendererRequested.current = true;

        setRoomRenderer(
            new RoomFurnitureRenderer(roomRef.current, {})
        );
    }, [roomRef]);

    useEffect(() => {
        if(!roomRenderer || !activeFurniture) {
            return;
        }

        roomRenderer.setFurniture(activeFurniture.furniture.type, 64, undefined, 0, activeFurniture.furniture.color ?? 0);
    }, [roomRenderer, activeFurniture]);

    useEffect(() => {
        if(!roomRenderer) {
            return;
        }

        return () => {
            roomRenderer.terminate();
        };
    }, [roomRenderer]);

    const onRoomRendererClick = useCallback(() => {
        roomRenderer?.progressFurnitureAnimation();
    }, [roomRenderer]);

    const handlePurchaseFurniture = useCallback(() => {
        if(!activeFurniture) {
            return;
        }

        // TODO: disable dialog
        const listener = (event: WebSocketEvent<ShopFurniturePurchasedEventData>) => {
            // TODO: handle error
            if(!event.data.success) {

            }
        };

        webSocketClient.addEventListener<WebSocketEvent<ShopFurniturePurchasedEventData>>("ShopFurniturePurchasedEvent", listener, {
            once: true
        });

        webSocketClient.send<PurchaseShopFurnitureEventData>("PurchaseShopFurnitureEvent", {
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
                    {shopFurniture.map((furniture) => (
                        <div key={furniture.id} style={{
                            width: 53,
                            height: 62,
                            boxSizing: "border-box",

                            borderRadius: 5,

                            border: (activeFurniture?.id === furniture.id)?("2px solid #62C4E8"):("2px solid transparent"),
                            background: (activeFurniture?.id === furniture.id)?("#FFFFFF"):(undefined),

                            display: "flex",
                            justifyContent: "center",

                            cursor: "pointer"
                        }} onClick={() => setActiveFurniture(furniture)}>
                            <div style={{
                                flex: 1,
                                alignSelf: "center",
                                justifySelf: "center"
                            }}>
                                <div style={{ height: 30, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <FurnitureIcon furnitureData={furniture.furniture}/>
                                </div>

                                {(furniture.credits) && (
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 2,
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                        padding: 2,
                                    }}>
                                        <b>{furniture.credits}</b>

                                        <div className="sprite_shop_credits"/>
                                    </div>
                                )}

                                {(furniture.duckets) && (
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 2,
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                        padding: 2,
                                    }}>
                                        <b>{furniture.duckets}</b>

                                        <div className="sprite_shop_duckets"/>
                                    </div>
                                )}

                                {(furniture.diamonds) && (
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 2,
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                        padding: 2,
                                    }}>
                                        <b>{furniture.diamonds}</b>

                                        <div className="sprite_shop_diamonds"/>
                                    </div>
                                )}
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
