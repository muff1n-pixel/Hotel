import { clientInstance, webSocketClient } from "@Game/index";
import { PurchaseShopPetData, ShopPetData, ShopPurchaseData } from "@pixel63/events";
import { useCallback } from "react";

export type ShopPurchasePetData = {
    activePet: ShopPetData;
    activePetElement: HTMLDivElement | null;
    name: string;
};

export default function useShopPurchasePet() {
    return useCallback((data: ShopPurchasePetData) => {
        return new Promise<boolean>((resolve) => {
            webSocketClient.addProtobuffListener(ShopPurchaseData, {
                async handle(payload: ShopPurchaseData) {
                    if(!payload.success) {
                        resolve(false);

                        return;
                    }

                    resolve(true);
    
                    if(data.activePetElement && data.activePet.pet) {
                        for(let index = 0; index < Math.min(payload.quantity, 10); index++) {
                            clientInstance.flyingFurnitureIcons.value!.push({
                                id: Math.random().toString(),
                                pet: data.activePet.pet,
                                position: data.activePetElement.getBoundingClientRect(),
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
    
            webSocketClient.sendProtobuff(PurchaseShopPetData, PurchaseShopPetData.create({
                id: data.activePet.id,
                name: data.name
            }));
        });
    }, []);
}