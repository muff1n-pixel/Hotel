import { useCallback, useEffect, useRef, useState } from "react";
import DialogPanel from "../../Dialog/Panels/DialogPanel";
import { ShopPageProps } from "./ShopPage";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import FurnitureIcon from "../../Furniture/FurnitureIcon";
import DialogButton from "../../Dialog/Button/DialogButton";
import RoomFurnitureRenderer from "@Client/Room/RoomFurnitureRenderer";
import { clientInstance, webSocketClient } from "../../../..";
import { ShopPageFurnitureData } from "@Shared/Communications/Responses/Shop/ShopPageFurnitureEventData";
import { PurchaseShopFurnitureEventData } from "@Shared/Communications/Requests/Shop/PurchaseShopFurnitureEventData";
import { ShopFurniturePurchasedEventData } from "@Shared/Communications/Responses/Shop/ShopFurniturePurchasedEventData";
import useShopPageFurniture from "./Hooks/useShopPageFurniture";
import RoomFurniturePlacer from "@Client/Room/RoomFurniturePlacer";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import { useDialogs } from "../../../hooks/useDialogs";

export default function ShopDefaultPage({ editMode, page }: ShopPageProps) {
    const dialogs = useDialogs();

    const roomRef = useRef<HTMLDivElement>(null);
    const roomRendererRequested = useRef<boolean>(false);

    const [roomRenderer, setRoomRenderer] = useState<RoomFurnitureRenderer>();
    
    const [activeFurniture, setActiveFurniture] = useState<ShopPageFurnitureData>();

    const [roomFurniturePlacer, setRoomFurniturePlacer] = useState<RoomFurniturePlacer>();

    const shopFurniture = useShopPageFurniture(page.id);

    useEffect(() => {
        if(!page.teaser) {
            setActiveFurniture(shopFurniture[0]);
        }
    }, [page, shopFurniture]);

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

        if(roomFurniturePlacer) {
            roomFurniturePlacer.destroy();

            setRoomFurniturePlacer(undefined);
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

    useEffect(() => {
        if(!roomFurniturePlacer) {
            return;
        }

        roomFurniturePlacer.startPlacing((position, direction) => {
            handlePurchaseFurniture(position, direction);
        }, () => {
            roomFurniturePlacer.destroy();

            setRoomFurniturePlacer(undefined);
        });
    }, [roomFurniturePlacer]);

    const onRoomRendererClick = useCallback(() => {
        if(roomFurniturePlacer) {
            roomFurniturePlacer.destroy();

            setRoomFurniturePlacer(undefined);
        }

        roomRenderer?.progressFurnitureAnimation();
    }, [roomRenderer, roomFurniturePlacer]);

    const handlePurchaseFurniture = useCallback((position?: RoomPosition, direction?: number) => {
        if(!activeFurniture) {
            return;
        }

        // TODO: disable dialog
        const listener = (event: WebSocketEvent<ShopFurniturePurchasedEventData>) => {
            if(roomFurniturePlacer) {
                roomFurniturePlacer.destroy();

                setRoomFurniturePlacer(undefined);
            }

            // TODO: handle error
            if(!event.data.success) {
                return;
            }
        };

        webSocketClient.addEventListener<WebSocketEvent<ShopFurniturePurchasedEventData>>("ShopFurniturePurchasedEvent", listener, {
            once: true
        });

        webSocketClient.send<PurchaseShopFurnitureEventData>("PurchaseShopFurnitureEvent", {
            shopFurnitureId: activeFurniture.id,
            position,
            direction
        });
    }, [activeFurniture, roomFurniturePlacer]);

    const onMouseDown = useCallback(() => {
        if(!clientInstance.roomInstance.value) {
            return;
        }

        if(!activeFurniture) {
            return;
        }

        if(roomFurniturePlacer) {
            roomFurniturePlacer.destroy();
        }

        setRoomFurniturePlacer(RoomFurniturePlacer.fromFurnitureData(clientInstance.roomInstance.value, activeFurniture.furniture));
    }, [ activeFurniture, roomFurniturePlacer ]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",

            gap: 10,

            overflow: "hidden"
        }}>
            <div onClick={onRoomRendererClick} onMouseDown={onMouseDown} style={{

                height: 240,
                width: "100%",

                cursor: "pointer",

                position: "relative"
            }}>
                <div ref={roomRef} style={{
                    height: "100%",
                    width: "100%",

                    opacity: (activeFurniture)?(1):(0)
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

                {(!activeFurniture && page.teaser) && (
                    <div style={{
                        position: "absolute",

                        left: 0,
                        top: 0,

                        width: "100%",
                        height: "100%",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <img src={`./assets/shop/teasers/${page.teaser}`}/>
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
                        }} onClick={() => (activeFurniture?.id !== furniture.id) && setActiveFurniture(furniture)}>
                            <div style={{
                                flex: 1,
                                alignSelf: "center",
                                justifySelf: "center",

                                position: "relative"
                            }}>
                                <div style={{ height: 30, display: "flex", justifyContent: "center", alignItems: "center" }} onMouseDown={onMouseDown}>
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

                                        <div className="sprite_currencies_credits-small"/>
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

                                        <div className="sprite_currencies_duckets-small"/>
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

                                        <div className="sprite_currencies_diamonds-small"/>
                                    </div>
                                )}

                                {(editMode) && (
                                    <div style={{
                                        position: "absolute",
                                        top: -10,
                                        right: -6,
                                        cursor: "pointer"
                                    }} onClick={() => dialogs.addUniqueDialog("edit-shop-furniture", { ...furniture, page: page })}>
                                        <div className="sprite_room_user_motto_pen"/>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {(editMode) && (
                        <div style={{
                            width: 53,
                            height: 62,

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",

                            cursor: "pointer"
                        }} onClick={() => dialogs.addUniqueDialog("edit-shop-furniture", { page })}>
                            <div className="sprite_add" style={{
                                marginTop: -8
                            }}/>
                        </div>
                    )}
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
