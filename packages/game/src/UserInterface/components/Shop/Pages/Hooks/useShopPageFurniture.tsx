import { useEffect, useRef, useState } from "react";
import { webSocketClient } from "../../../../..";
import { GetShopPageFurnitureData, ShopFurnitureData, ShopPageFurnitureData } from "@pixel63/events";

export default function useShopPageFurniture(pageId: string) {
    const [shopFurnitures, setShopFurnitures] = useState<ShopFurnitureData[]>([]);
    const shopFurnituresRequested = useRef<string>("");

    useEffect(() => {
        setShopFurnitures([]);

        const listener = webSocketClient.addProtobuffListener(ShopPageFurnitureData, {
            async handle(payload: ShopPageFurnitureData) {
                if(payload.pageId === pageId) {
                    setShopFurnitures(payload.furniture);
                }
            },
        })

        if(shopFurnituresRequested.current !== pageId) {
            webSocketClient.sendProtobuff(GetShopPageFurnitureData, GetShopPageFurnitureData.create({
                pageId
            }));

            shopFurnituresRequested.current = pageId;
        }

        return () => {
            webSocketClient.removeProtobuffListener(ShopPageFurnitureData, listener);
        };
    }, [pageId]);

    return shopFurnitures;
}
