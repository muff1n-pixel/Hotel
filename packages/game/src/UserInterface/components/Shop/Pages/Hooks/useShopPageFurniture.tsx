import { ShopPageFurnitureData, ShopPageFurnitureEventData } from "@Shared/Communications/Responses/Shop/ShopPageFurnitureEventData";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { useEffect, useRef, useState } from "react";
import { webSocketClient } from "../../../../..";
import { GetShopPageFurnitureEventData } from "@Shared/Communications/Requests/Shop/GetShopPageFurnitureEventData";

export default function useShopPageFurniture(pageId: string) {
    const [shopFurnitures, setShopFurnitures] = useState<ShopPageFurnitureData[]>([]);
    const shopFurnituresRequested = useRef<string>("");

    useEffect(() => {
        setShopFurnitures([]);

        const listener = (event: WebSocketEvent<ShopPageFurnitureEventData>) => {
            if(event.data.pageId === pageId) {
                setShopFurnitures(event.data.furniture);
            }
        };

        webSocketClient.addEventListener<WebSocketEvent<ShopPageFurnitureEventData>>("ShopPageFurnitureEvent", listener);

        if(shopFurnituresRequested.current !== pageId) {
            webSocketClient.send<GetShopPageFurnitureEventData>("GetShopPageFurnitureEvent", {
                pageId: pageId
            });

            shopFurnituresRequested.current = pageId;
        }

        return () => {
            webSocketClient.removeEventListener<WebSocketEvent<ShopPageFurnitureEventData>>("ShopPageFurnitureEvent", listener);
        };
    }, [pageId]);

    return shopFurnitures;
}
