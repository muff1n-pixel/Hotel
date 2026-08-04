import { webSocketClient } from "@Game/index";
import { EnterRoomData, PurchaseShopBundleData, ShopBundlePurchaseData, ShopFurnitureData, ShopPageData } from "@pixel63/events";
import { useCallback } from "react";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";

export type ShopPurchaseBundleData = {
    page: ShopPageData;
    shopFurniture: ShopFurnitureData[];
};

export default function useShopPurchaseBundle() {
    const dialogs = useDialogs();

    return useCallback((data: ShopPurchaseBundleData) => {
        return new Promise<boolean>((resolve) => {
            webSocketClient.addProtobuffListener(ShopBundlePurchaseData, {
                async handle(payload: ShopBundlePurchaseData) {
                    if(!payload.success) {
                        resolve(false);

                        return;
                    }

                    resolve(true);
    
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
                id: data.page.bundle?.id
            }));
        });
    }, [dialogs]);
}