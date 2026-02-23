import { ShopPageBotData, ShopPageBotsEventData } from "@Shared/Communications/Responses/Shop/ShopPageBotsEventData";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { useEffect, useRef, useState } from "react";
import { webSocketClient } from "../../../../..";
import { GetShopPageBotsEventData } from "@Shared/Communications/Requests/Shop/GetShopPageBotsEventData";

export default function useShopPageBots(pageId: string) {
    const [bots, setBots] = useState<ShopPageBotData[]>([]);
    const pageIdRequested = useRef<string>("");

    useEffect(() => {
        setBots([]);

        const listener = (event: WebSocketEvent<ShopPageBotsEventData>) => {
            if(event.data.pageId === pageId) {
                setBots(event.data.bots);
            }
        };

        webSocketClient.addEventListener<WebSocketEvent<ShopPageBotsEventData>>("ShopPageBotsEvent", listener);

        if(pageIdRequested.current !== pageId) {
            webSocketClient.send<GetShopPageBotsEventData>("GetShopPageBotsEvent", {
                pageId: pageId
            });

            pageIdRequested.current = pageId;
        }

        return () => {
            webSocketClient.removeEventListener<WebSocketEvent<ShopPageBotsEventData>>("ShopPageBotsEvent", listener);
        };
    }, [pageId]);

    return bots;
}
