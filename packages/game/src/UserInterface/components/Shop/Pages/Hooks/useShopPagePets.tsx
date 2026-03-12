import { useEffect, useRef, useState } from "react";
import { webSocketClient } from "../../../../..";
import { GetShopPagePetsData, ShopPetData, ShopPagePetsData } from "@pixel63/events";

export default function useShopPagePets(pageId: string) {
    const [pets, setPets] = useState<ShopPetData[]>([]);
    const pageIdRequested = useRef<string>("");

    useEffect(() => {
        setPets([]);

        const listener = webSocketClient.addProtobuffListener(ShopPagePetsData, {
            async handle(payload: ShopPagePetsData) {
                if(payload.pageId === pageId) {
                    setPets(payload.pets);
                }
            },
        });

        if(pageIdRequested.current !== pageId) {
            webSocketClient.sendProtobuff(GetShopPagePetsData, GetShopPagePetsData.create({
                pageId
            }));

            pageIdRequested.current = pageId;
        }

        return () => {
            webSocketClient.removeProtobuffListener(ShopPagePetsData, listener);
        };
    }, [pageId]);

    return pets;
}
