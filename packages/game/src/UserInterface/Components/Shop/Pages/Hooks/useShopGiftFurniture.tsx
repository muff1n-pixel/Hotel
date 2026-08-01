import { useEffect, useRef, useState } from "react";
import { webSocketClient } from "../../../../..";
import { FurnitureData, GetShopGiftFurnitureData, ShopGiftFurnitureData } from "@pixel63/events";

export default function useShopGiftFurniture() {
    const [furniture, setFurniture] = useState<FurnitureData[]>([]);

    const shopFurnituresRequested = useRef(false);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(ShopGiftFurnitureData, {
            async handle(payload: ShopGiftFurnitureData) {
                setFurniture(payload.furniture);
            },
        })

        shopFurnituresRequested.current = true;

        webSocketClient.sendProtobuff(GetShopGiftFurnitureData, GetShopGiftFurnitureData.create({}));

        return () => {
            webSocketClient.removeProtobuffListener(ShopGiftFurnitureData, listener);
        };
    }, []);

    return furniture;
}
