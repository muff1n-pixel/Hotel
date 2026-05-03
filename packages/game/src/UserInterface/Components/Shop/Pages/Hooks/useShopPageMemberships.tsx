import { useEffect, useRef, useState } from "react";
import { webSocketClient } from "../../../../..";
import { GetShopPageMembershipsData, ShopMembershipData, ShopMembershipsData } from "@pixel63/events";

export default function useShopPageMemberships(pageId: string) {
    const [shopMemberships, setShopMemberships] = useState<ShopMembershipData[]>([]);
    const shopMembershipsRequested = useRef<string>("");

    useEffect(() => {
        setShopMemberships([]);

        const listener = webSocketClient.addProtobuffListener(ShopMembershipsData, {
            async handle(payload: ShopMembershipsData) {
                if(payload.pageId === pageId) {
                    setShopMemberships(payload.memberships);
                }
            },
        })

        if(shopMembershipsRequested.current !== pageId) {
            webSocketClient.sendProtobuff(GetShopPageMembershipsData, GetShopPageMembershipsData.create({
                pageId
            }));

            shopMembershipsRequested.current = pageId;
        }

        return () => {
            webSocketClient.removeProtobuffListener(ShopMembershipsData, listener);
        };
    }, [pageId]);

    return shopMemberships;
}
