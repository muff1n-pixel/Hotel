import { useEffect, useRef, useState } from "react";
import { webSocketClient } from "../../../../..";
import { GetShopPageBotsData, ShopBotData, ShopPageBotsData } from "@pixel63/events";

export default function useShopPageBots(pageId: string) {
    const [bots, setBots] = useState<ShopBotData[]>([]);
    const pageIdRequested = useRef<string>("");

    useEffect(() => {
        setBots([]);

        const listener = webSocketClient.addProtobuffListener(ShopPageBotsData, {
            async handle(payload: ShopPageBotsData) {
                if(payload.pageId === pageId) {
                    setBots(payload.bots);
                }
            },
        });

        if(pageIdRequested.current !== pageId) {
            webSocketClient.sendProtobuff(GetShopPageBotsData, GetShopPageBotsData.create({
                pageId
            }));

            pageIdRequested.current = pageId;
        }

        return () => {
            webSocketClient.removeProtobuffListener(ShopPageBotsData, listener);
        };
    }, [pageId]);

    return bots;
}
