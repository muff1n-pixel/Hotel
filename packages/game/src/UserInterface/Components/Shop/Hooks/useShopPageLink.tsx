import { webSocketClient } from "@Game/index";
import { GetShopPageLinkData, ShopPageLinkData } from "@pixel63/events";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useCallback, useEffect, useState } from "react";

export default function useShopPageLink(type: string) {
    const dialogs = useDialogs();

    const [data, setData] = useState<ShopPageLinkData>();
    
    useEffect(() => {
        webSocketClient.addProtobuffListener(ShopPageLinkData, {
            async handle(payload: ShopPageLinkData) {
                setData(payload);
            },
        }, {
            once: true
        });

        webSocketClient.sendProtobuff(GetShopPageLinkData, GetShopPageLinkData.create({
            type
        }));
    }, [type]);

    const openShopPage = useCallback(() => {
        if(!data) {
            return;
        }

        dialogs.openUniqueDialog("shop", {
            requestedPage: {
                id: data.pageId,
                category: data.category
            }
        });
    }, [data]);

    return {
        data,
        openShopPage
    };
}
