import { useCallback, useEffect, useRef, useState } from "react";
import DialogPanel from "../../Dialog/Panels/DialogPanel";
import { ShopPageProps } from "./ShopPage";
import FurnitureIcon from "../../Furniture/FurnitureIcon";
import DialogButton from "../../Dialog/Button/DialogButton";
import { clientInstance, webSocketClient } from "../../../..";
import { PurchaseShopFurnitureEventData } from "@Shared/Communications/Requests/Shop/PurchaseShopFurnitureEventData";
import useShopPageFurniture from "./Hooks/useShopPageFurniture";
import { useDialogs } from "../../../hooks/useDialogs";
import { useUser } from "../../../hooks/useUser";
import FurnitureImage from "../../Furniture/FurnitureImage";
import TextArea from "../../Form/TextArea";
import Furniture from "@Client/Furniture/Furniture";
import DialogCurrencyPanel from "../../Dialog/Panels/DialogCurrencyPanel";
import { ShopFurnitureData, ShopFurniturePurchaseData } from "@pixel63/events";

export default function ShopTrophiesPage({ editMode, page }: ShopPageProps) {
    const dialogs = useDialogs();
    const user = useUser();

    const shopFurniture = useShopPageFurniture(page.id);

    const activeFurnitureRef = useRef<HTMLCanvasElement>(null);

    const [activeFurniture, setActiveFurniture] = useState<ShopFurnitureData>();
    const [activeFilteredFurniture, setActiveFilteredFurniture] = useState<{ furniture: ShopFurnitureData; color: string; }[]>([]);

    const [filteredShopFurniture, setFilteredShopFurniture] = useState<ShopFurnitureData[]>([]);
    const [engraving, setEngraving] = useState("");

    useEffect(() => {
        if(!page.teaser) {
            setActiveFurniture(filteredShopFurniture[0]);
        }
    }, [page, filteredShopFurniture]);

    useEffect(() => {
        const filteredShopFurniture: ShopFurnitureData[] = [];

        for(const furniture of shopFurniture) {
            if(filteredShopFurniture.some((filteredFurniture) => filteredFurniture.furniture?.type === furniture.furniture?.type)) {
                continue;
            }

            const filteredFurniture = shopFurniture.find((unfilteredFurniture) => unfilteredFurniture.furniture?.type === furniture.furniture?.type && unfilteredFurniture.furniture?.color === 1) ?? furniture;

            filteredShopFurniture.push(filteredFurniture);
        }

        setFilteredShopFurniture(filteredShopFurniture);
    }, [shopFurniture]);

    useEffect(() => {
        if(!activeFurniture) {
            setActiveFilteredFurniture([]);

            return;
        }

        setActiveFilteredFurniture([]);

        Promise.all(shopFurniture
            .filter((furniture) => furniture.furniture?.type === activeFurniture.furniture?.type)
            .sort((a, b) => (a.furniture?.color ?? 0) - (b.furniture?.color ?? 0))
            .map(async (shopFurniture) => {
                const furniture =  new Furniture(shopFurniture.furniture?.type, 64, undefined, undefined, undefined);

                await furniture.getData();

                return {
                    furniture: shopFurniture,
                    color: '#' + (furniture.getColor(shopFurniture.furniture?.color ?? 0) ?? "FFFFFF")
                };
            }))
            .then(setActiveFilteredFurniture);
    }, [activeFurniture, shopFurniture]);

    const handlePurchaseFurniture = useCallback(() => {
        if(!activeFurniture) {
            return;
        }

        // TODO: disable dialog
        webSocketClient.addProtobuffListener(ShopFurniturePurchaseData, {
            async handle(payload: ShopFurniturePurchaseData) {
                if(!payload.success) {
                    return;
                }

                if(activeFurnitureRef.current) {
                    clientInstance.flyingFurnitureIcons.value!.push({
                        id: Math.random().toString(),
                        furniture: activeFurniture.furniture,
                        position: activeFurnitureRef.current.getBoundingClientRect(),
                        targetElementId: "toolbar-inventory"
                    });

                    clientInstance.flyingFurnitureIcons.update();
                }
            },
        }, {
            once: true
        });

        webSocketClient.send<PurchaseShopFurnitureEventData>("PurchaseShopFurnitureEvent", {
            shopFurnitureId: activeFurniture.id,
            data: {
                engraving
            }
        });
    }, [activeFurniture, engraving, activeFurnitureRef]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",

            gap: 10,

            overflow: "hidden"
        }}>
            <div style={{
                flex: 1,

                width: "100%",

                display: "flex",
                flexDirection: "column",
                gap: 10,

                position: "relative"
            }}>
                {(activeFurniture) && (
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        minHeight: 140
                    }}>
                        <FurnitureImage furnitureData={activeFurniture.furniture}/>
                    </div>
                )}

                <div style={{ flex: 1 }}/>

                {(activeFurniture) && (
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,

                        justifyContent: "space-between"
                    }}>
                        <div>
                            <b>{activeFurniture.furniture?.name}</b>

                            {(activeFurniture.furniture?.description) && (
                                <p style={{ fontSize: 12 }}>{activeFurniture.furniture?.description}</p>
                            )}
                        </div>

                        <div>
                            <DialogCurrencyPanel credits={activeFurniture.credits} duckets={activeFurniture.duckets} diamonds={activeFurniture.diamonds}/>
                        </div>
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

            {(activeFilteredFurniture.length > 1) && (
                <DialogPanel>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        padding: 2
                    }}>
                        {activeFilteredFurniture.map((furniture) => (
                            <div key={furniture.furniture?.id} style={{
                                border: "1px solid black",
                                borderRadius: 3,
                                cursor: "pointer"
                            }} onClick={() => setActiveFurniture(furniture.furniture)}>
                                <div style={{
                                    width: 38,
                                    height: 30,

                                    border: "2px solid white",
                                    borderWidth: (activeFurniture?.id === furniture.furniture?.id)?(4):(2),
                                    borderRadius: 3,
                                    boxSizing: "border-box",

                                    boxShadow: (activeFurniture?.id === furniture.furniture?.id)?("inset 0 0 0 1px rgba(0, 0, 0, .4)"):("none"),

                                    background: furniture.color ?? ""
                                }}/>
                            </div>
                        ))}
                    </div>
                </DialogPanel>
            )}

            <DialogPanel style={{ flex: "1 1 0", overflow: "hidden" }} contentStyle={{ display: "flex", flex: 1 }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    
                    padding: 4,
                    overflowY: "scroll"
                }}>
                    {((editMode)?(shopFurniture):(filteredShopFurniture)).map((furniture) => (
                        <div key={furniture.id} style={{
                            width: 53,
                            height: 62,
                            boxSizing: "border-box",

                            borderRadius: 5,

                            border: (activeFurniture?.furniture?.type === furniture.furniture?.type)?("2px solid #62C4E8"):("2px solid transparent"),
                            background: (activeFurniture?.furniture?.type === furniture.furniture?.type)?("#FFFFFF"):(undefined),

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
                                <div style={{ height: 30, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <FurnitureIcon ref={(activeFurniture?.furniture?.type === furniture.furniture?.type)?(activeFurnitureRef):(undefined)} furnitureData={furniture.furniture}/>
                                </div>

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
                display: "flex",
                flexDirection: "column",
                gap: 5
            }}>
                <div style={{ fontSize: 12 }}>Add your own engraving below, but be careful - it's permanent!</div>
                
                <TextArea value={engraving} onChange={setEngraving} style={{
                    height: 90
                }}/>
            </div>

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

                    <DialogButton disabled={!activeFurniture || (
                        (activeFurniture.credits ?? 0) > user.credits
                        || (activeFurniture.duckets ?? 0) > user.duckets
                        || (activeFurniture.diamonds ?? 0) > user.diamonds
                    )} style={{ flex: 1 }} onClick={handlePurchaseFurniture}>Purchase</DialogButton>
                </div>
            </div>
        </div>
    );
}
