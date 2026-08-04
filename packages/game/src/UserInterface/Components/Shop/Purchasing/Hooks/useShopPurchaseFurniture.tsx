import { clientInstance, webSocketClient } from "@Game/index";
import { GroupData, PurchaseShopFurnitureData, RoomPositionData, ShopFurnitureData, ShopPurchaseData, UserFurnitureCustomData } from "@pixel63/events";
import { useCallback } from "react";
import { PurchasableItem } from "../../Pages/Hooks/usePurchasableItem";

export type ShopPurchaseFurnitureData = {
    activeFurniture: ShopFurnitureData;
    activeFurnitureElement: HTMLCanvasElement | null;

    data?: UserFurnitureCustomData;

    purchasableItem?: PurchasableItem;
    group?: GroupData;
    position?: RoomPositionData;
    direction?: number;
    quantity?: number;
    stopPlacing?: () => void;
};

export default function useShopPurchaseFurniture() {
    return useCallback((data: ShopPurchaseFurnitureData) => {
        return new Promise<boolean>((resolve) => {
            webSocketClient.addProtobuffListener(ShopPurchaseData, {
                async handle(payload: ShopPurchaseData) {
    
                    if(!payload.success) {
                        resolve(false);
    
                        return;
                    }
    
                    resolve(true);
    
                    if(data.purchasableItem?.placing) {
                        data.stopPlacing?.();
                    }
    
                    if(data.position) {
                        return;
                    }
    
                    if(data.activeFurnitureElement && data.activeFurniture.furniture) {
                        for(let index = 0; index < Math.min(payload.quantity, 10); index++) {
                            clientInstance.flyingFurnitureIcons.value!.push({
                                id: Math.random().toString(),
                                furniture: data.activeFurniture.furniture,
                                position: data.activeFurnitureElement.getBoundingClientRect(),
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
                id: data.activeFurniture.id,
    
                position: data.position,
                direction: data.direction,
    
                groupId: data.group?.id,
    
                quantity: (data.purchasableItem?.placing)?(1):(data.quantity),
    
                data: data.data
            }));
        });
    }, []);
}