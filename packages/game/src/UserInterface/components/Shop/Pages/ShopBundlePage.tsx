import { useCallback, useRef } from "react";
import DialogPanel from "../../../Common/Dialog/Components/Panels/DialogPanel";
import { ShopPageProps } from "./ShopPage";
import FurnitureIcon from "../../Furniture/FurnitureIcon";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { clientInstance, webSocketClient } from "../../../..";
import useShopPageFurniture from "./Hooks/useShopPageFurniture";
import { useDialogs } from "../../../Hooks/useDialogs";
import { PurchaseShopBundleData, ShopBundlePurchaseData } from "@pixel63/events";
import DialogScrollArea from "../../../Common/Dialog/Components/Scroll/DialogScrollArea";
import DialogCurrencyPanel from "@UserInterface/Common/Dialog/Components/Panels/DialogCurrencyPanel";

export default function ShopBundlePage({ editMode, page }: ShopPageProps) {
    const shopFurnitureRefs = useRef<(HTMLDivElement | null)[]>([]);

    const dialogs = useDialogs();

    const shopFurniture = useShopPageFurniture(page.id);

    const handlePurchaseFurniture = useCallback(() => {
        webSocketClient.addProtobuffListener(ShopBundlePurchaseData, {
            async handle(payload: ShopBundlePurchaseData) {
                if(!payload.success) {
                    return;
                }

                for(const furniture of shopFurniture) {
                    const furnitureRef = shopFurnitureRefs.current[shopFurniture.indexOf(furniture)];

                    if(furnitureRef) {
                        clientInstance.flyingFurnitureIcons.value!.push({
                            id: Math.random().toString(),
                            furniture: furniture.furniture!,
                            position: furnitureRef.getBoundingClientRect(),
                            targetElementId: "toolbar-inventory"
                        });
                    }
                }

                clientInstance.flyingFurnitureIcons.update();
            },
        }, {
            once: true
        });

        webSocketClient.sendProtobuff(PurchaseShopBundleData, PurchaseShopBundleData.create({
            id: page.bundle?.id
        }));
    }, [page, shopFurniture, shopFurnitureRefs]);

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

                display: "flex",
                flexDirection: "row",
                gap: 10,

                height: 240,
                width: "100%",

                position: "relative"
            }}>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",

                    gap: 10
                }}>
                    <div style={{ alignSelf: "flex-end" }}>
                        <DialogCurrencyPanel credits={page.bundle?.credits} duckets={page.bundle?.duckets} diamonds={page.bundle?.diamonds}/>
                    </div>

                    {(page.teaser) && (
                        <div>
                            <img src={`./assets/shop/teasers/${page.teaser}`}/>
                        </div>
                    )}
                </div>

                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    <div>
                        <h3 style={{ color: "#BB3834", fontFamily: "Ubuntu Bold Italic", paddingBottom: 5 }}>What's included:</h3>

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
                                    {shopFurniture.map((furniture, index) => (
                                        <div key={furniture.id} style={{
                                            width: 36,
                                            height: 36,
                                            boxSizing: "border-box",

                                            borderRadius: 5,

                                            border: "2px solid transparent",

                                            display: "flex",
                                            justifyContent: "center",

                                            cursor: "pointer"
                                        }}>
                                            <div style={{
                                                flex: 1,
                                                alignSelf: "center",
                                                justifySelf: "center",

                                                position: "relative"
                                            }}>
                                                <div ref={(element) => { shopFurnitureRefs.current[index] = element }} style={{ height: 30, display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                            width: 36,
                                            height: 36,

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
                    </div>
                </div>
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

                    <DialogButton style={{ flex: 1 }} onClick={handlePurchaseFurniture}>Purchase</DialogButton>
                </div>
            </div>
        </div>
    );
}
