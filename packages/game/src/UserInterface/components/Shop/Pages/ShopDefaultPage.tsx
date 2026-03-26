import { useCallback, useEffect, useRef, useState } from "react";
import DialogPanel from "../../../Common/Dialog/Components/Panels/DialogPanel";
import { ShopPageProps } from "./ShopPage";
import FurnitureIcon from "../../Furniture/FurnitureIcon";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import RoomFurnitureRenderer from "@Client/Room/RoomFurnitureRenderer";
import { clientInstance, webSocketClient } from "../../../..";
import useShopPageFurniture from "./Hooks/useShopPageFurniture";
import RoomFurniturePlacer from "@Client/Room/RoomFurniturePlacer";
import { useDialogs } from "../../../Hooks/useDialogs";
import { useUser } from "../../../Hooks/useUser";
import { useRoomInstance } from "../../../Hooks/useRoomInstance";
import { PurchaseShopFurnitureData, RoomPositionData, ShopFurnitureData, ShopFurniturePurchaseData } from "@pixel63/events";
import DialogScrollArea from "../../../Common/Dialog/Components/Scroll/DialogScrollArea";
import usePurchasableItem from "@UserInterface/Components/Shop/Pages/Hooks/usePurchasableItem";
import DialogCurrencyPanel from "@UserInterface/Common/Dialog/Components/Panels/DialogCurrencyPanel";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import Input from "@UserInterface/Common/Form/Components/Input";

export default function ShopDefaultPage({ editMode, page, requestedFurnitureId }: ShopPageProps) {
    const dialogs = useDialogs();
    const user = useUser();
    const room = useRoomInstance();

    const shopFurniture = useShopPageFurniture(page.id);

    const roomRef = useRef<HTMLDivElement>(null);
    const roomRendererRequested = useRef<boolean>(false);
    const activeFurnitureRef = useRef<HTMLCanvasElement>(null);

    const [roomRenderer, setRoomRenderer] = useState<RoomFurnitureRenderer>();
    const [activeFurniture, setActiveFurniture] = useState<ShopFurnitureData>();
    const [quantity, setQuantity] = useState(1);

    const handlePurchaseFurniture = useCallback((stopPlacing?: () => void, position?: RoomPositionData, direction?: number) => {
        if(!activeFurniture) {
            return;
        }

        // TODO: disable dialog
        webSocketClient.addProtobuffListener(ShopFurniturePurchaseData, {
            async handle(payload: ShopFurniturePurchaseData) {
                if(!payload.success) {
                    return;
                }

                if(purchasableItem.placing) {
                    stopPlacing?.();

                    return;
                }

                if(position) {
                    return;
                }

                if(activeFurnitureRef.current && activeFurniture.furniture) {
                    for(let index = 0; index < Math.min(payload.quantity, 10); index++) {
                        clientInstance.flyingFurnitureIcons.value!.push({
                            id: Math.random().toString(),
                            furniture: activeFurniture.furniture,
                            position: activeFurnitureRef.current.getBoundingClientRect(),
                            targetElementId: "toolbar-inventory"
                        });

                        clientInstance.flyingFurnitureIcons.update();

                        await new Promise((resolve) => setTimeout(resolve, 50));
                    }
                }
            },
        }, {
            once: true
        });

        webSocketClient.sendProtobuff(PurchaseShopFurnitureData, PurchaseShopFurnitureData.create({
            id: activeFurniture.id,

            position,
            direction,

            quantity: (purchasableItem.placing)?(1):(quantity)
        }));
    }, [activeFurniture, activeFurnitureRef, quantity]);

    const purchasableItem = usePurchasableItem(handlePurchaseFurniture);

    useEffect(() => {
        if(requestedFurnitureId) {
            const requestedShopFurniture = shopFurniture.find((furniture) => furniture.furniture?.id === requestedFurnitureId);

            if(requestedShopFurniture) {
                setActiveFurniture(requestedShopFurniture);

                return;
            }
        }

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
        if(!roomRenderer || !activeFurniture?.furniture) {
            return;
        }

        //purchasableItem.stopPlacing();

        roomRenderer.setFurniture(activeFurniture.furniture.type, 64, undefined, 0, activeFurniture.furniture.color ?? 0);
    }, [roomRenderer, activeFurniture, purchasableItem]);

    useEffect(() => {
        if(!roomRenderer) {
            return;
        }

        return () => {
            roomRenderer.terminate();
        };
    }, [roomRenderer]);

    const onRoomRendererClick = useCallback(() => {
        purchasableItem.stopPlacing();

        roomRenderer?.progressFurnitureAnimation();
    }, [roomRenderer, purchasableItem]);

    const onMouseDown = useCallback((furniture: ShopFurnitureData) => {
        if(!clientInstance.roomInstance.value) {
            return;
        }

        if(activeFurniture?.id !== furniture.id) {
            return;
        }

        const mousemove = () => {
            document.body.removeEventListener("mousemove", mousemove);

            if(room && furniture.furniture) {
                if((activeFurniture.credits ?? 0) > user.credits
                        || (activeFurniture.duckets ?? 0) > user.duckets
                        || (activeFurniture.diamonds ?? 0) > user.diamonds) {
                    return;
                }

                purchasableItem.startPlacing(RoomFurniturePlacer.fromFurnitureData(room, furniture.furniture));                
            }
        };

        document.body.addEventListener("mousemove", mousemove);

        document.body.addEventListener("mouseup", () => {
            document.body.removeEventListener("mousemove", mousemove);
        }, {
            once: true
        });
    }, [ dialogs, room, activeFurniture, purchasableItem ]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",

            gap: 10,

            overflow: "hidden"
        }}>
            <div onClick={onRoomRendererClick} onMouseDown={() => activeFurniture && onMouseDown(activeFurniture)} style={{

                height: 240,
                width: "100%",

                cursor: (activeFurniture)?("pointer"):("inherit"),

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
                        <b>{activeFurniture.furniture?.name}</b>

                        {(activeFurniture.furniture?.description) && (
                            <p style={{ fontSize: 12 }}>{activeFurniture.furniture.description}</p>
                        )}
                    </div>
                )}

                {(activeFurniture) && (
                    <div style={{
                        position: "absolute",
                        right: 0,
                        bottom: 0,

                        padding: 10,
                    }}>
                        <DialogCurrencyPanel credits={activeFurniture.credits} duckets={activeFurniture.duckets} diamonds={activeFurniture.diamonds}/>
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
                <DialogScrollArea hideInactive>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        
                        padding: 4,
                        paddingRight: 0,
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
                                    <div style={{ height: 30, display: "flex", justifyContent: "center", alignItems: "center" }} onMouseDown={() => onMouseDown(furniture)}>
                                        <FurnitureIcon ref={(activeFurniture?.id === furniture.id)?(activeFurnitureRef):(undefined)} furnitureData={furniture.furniture}/>
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
                </DialogScrollArea>
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
                    <FlexLayout flex={1} direction="row" align="center">
                        <div style={{ color: "#6A6A69" }}>Quantity</div>

                        <Input style={{ width: 30 }} value={quantity.toString()} min={1} max={100} onChange={(value) => setQuantity(window.isNaN(parseInt(value))?(1):(parseInt(value)))}/>
                    </FlexLayout>

                    <DialogButton color="green" disabled={!activeFurniture || (
                        (activeFurniture.credits ?? 0) > user.credits
                        || (activeFurniture.duckets ?? 0) > user.duckets
                        || (activeFurniture.diamonds ?? 0) > user.diamonds
                    )} style={{ flex: 1 }} onClick={handlePurchaseFurniture}>Purchase</DialogButton>
                </div>
            </div>
        </div>
    );
}
