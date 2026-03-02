import { useEffect, useState } from "react";
import { webSocketClient } from "../../..";
import { FurnitureTypesData, GetFurnitureTypesData } from "@pixel63/events";

export default function useFurnitureTypes() {
    const [categories, setCategories] = useState<string[]>([]);
    const [interactionTypes, setInteractionTypes] = useState<string[]>([]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(FurnitureTypesData, {
            handle: async (payload: FurnitureTypesData) => {
                setCategories(payload.categories);
                setInteractionTypes(payload.interactionTypes);
            }
        });

        webSocketClient.sendProtobuff(GetFurnitureTypesData, GetFurnitureTypesData.create({}));

        return () => {
            webSocketClient.removeProtobuffListener(FurnitureTypesData, listener);
        };
    }, []);

    return {
        categories, interactionTypes
    };
}