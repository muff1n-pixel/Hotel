import { clientInstance, webSocketClient } from "@Game/index";
import { PurchaseShopBotData, ShopBotData, ShopPurchaseData } from "@pixel63/events";
import { useCallback } from "react";

export type ShopPurchaseBotData = {
    activeBot: ShopBotData;
    activeBotElement: HTMLDivElement | null;
};

export default function useShopPurchaseBot() {
    return useCallback((data: ShopPurchaseBotData) => {
        return new Promise<boolean>((resolve) => {
            webSocketClient.addProtobuffListener(ShopPurchaseData, {
                async handle(payload: ShopPurchaseData) {
                    if(!payload.success) {
                        resolve(false);

                        return;
                    }

                    resolve(true);
    
                    if(data.activeBotElement && data.activeBot.figureConfiguration) {
                        for(let index = 0; index < Math.min(payload.quantity, 10); index++) {
                            clientInstance.flyingFurnitureIcons.value!.push({
                                id: Math.random().toString(),
                                figureConfiguration: data.activeBot.figureConfiguration,
                                position: data.activeBotElement.getBoundingClientRect(),
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
    
            webSocketClient.sendProtobuff(PurchaseShopBotData, PurchaseShopBotData.create({
                id: data.activeBot.id
            }));
        });
    }, []);
}