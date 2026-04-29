import { useCallback, useRef } from "react";
import DialogPanel from "../../../Common/Dialog/Components/Panels/DialogPanel";
import { ShopPageProps } from "./ShopPage";
import FurnitureIcon from "../../Furniture/FurnitureIcon";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { clientInstance, webSocketClient } from "../../../..";
import useShopPageFurniture from "./Hooks/useShopPageFurniture";
import { useDialogs } from "../../../Hooks2/useDialogs";
import { EnterRoomData, PurchaseShopBundleData, ShopBundlePurchaseData } from "@pixel63/events";
import DialogScrollArea from "../../../Common/Dialog/Components/Scroll/DialogScrollArea";
import DialogCurrencyPanel from "@UserInterface/Common/Dialog/Components/Panels/DialogCurrencyPanel";
import BadgeImage from "@UserInterface/Common/Badges/BadgeImage";

export default function ShopBundlePage({ page }: ShopPageProps) {
    const shopFurnitureRefs = useRef<(HTMLDivElement | null)[]>([]);

    const dialogs = useDialogs();

    const shopFurniture = useShopPageFurniture(page.id, page.type);

    const handlePurchaseFurniture = useCallback(() => {
        webSocketClient.addProtobuffListener(ShopBundlePurchaseData, {
            async handle(payload: ShopBundlePurchaseData) {
                if(!payload.success) {
                    return;
                }

                if(payload.roomId) {
                    dialogs.closeDialog("shop");

                    webSocketClient.sendProtobuff(EnterRoomData, EnterRoomData.create({
                        id: payload.roomId
                    }));
                }
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
                    <div style={{
                        width: "100%",

                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <div>
                            {page.bundle?.badge && (
                                <BadgeImage badge={page.bundle.badge}/>
                            )}
                        </div>
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
                    justifyContent: "center",
                    gap: 10
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",

                        gap: 10
                    }}>
                        <h3 style={{ color: "#BB3834", fontFamily: "Ubuntu Bold Italic" }}>What's included:</h3>

                        <DialogPanel contentStyle={{ display: "flex", flex: 1 }}>
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
                                            justifyContent: "center"
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

                                                {(furniture.quantity) && (
                                                    <div style={{
                                                        position: "absolute",
                                                        top: -4,
                                                        right: -6,
                                                        cursor: "pointer",

                                                        fontSize: 10,

                                                        background: "#FF3200",
                                                        color: "#CCCB65",

                                                        borderRadius: 6,

                                                        padding: "1px 2px 1px 4px"
                                                    }}>
                                                        x{furniture.quantity}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DialogScrollArea>
                        </DialogPanel>

                        <div style={{ alignSelf: "flex-end" }}>
                            <DialogCurrencyPanel credits={page.bundle?.credits} duckets={page.bundle?.duckets} diamonds={page.bundle?.diamonds}/>
                        </div>
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
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    {(page.bundle?.roomId)?(
                        <div style={{
                            flex: 1,

                            cursor: "pointer",
                            textDecoration: "underline",
                            fontFamily: "Ubuntu Italic",

                            textAlign: "center",
                        }} onClick={() => {
                            webSocketClient.sendProtobuff(EnterRoomData, EnterRoomData.create({
                                id: page.bundle?.roomId
                            }))
                        }}>
                            View room bundle
                        </div>
                    ):(
                        <div style={{ flex: 1 }}/>
                    )}

                    <DialogButton color="green" style={{ flex: 1 }} onClick={handlePurchaseFurniture}>Purchase</DialogButton>
                </div>
            </div>
        </div>
    );
}
