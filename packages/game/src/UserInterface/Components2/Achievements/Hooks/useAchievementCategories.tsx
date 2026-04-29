import { AchievementsCategoriesData, AchievementsCategoryData, GetAchievementsCategoriesData } from "@pixel63/events";
import { useEffect, useState } from "react";
import { webSocketClient } from "@Game/index";

export function useAchievementCategories() {
    const [value, setValue] = useState<AchievementsCategoryData[]>();

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(AchievementsCategoriesData, {
            async handle(payload: AchievementsCategoriesData) {
                setValue(payload.categories);
            },
        });

        webSocketClient.sendProtobuff(GetAchievementsCategoriesData, GetAchievementsCategoriesData.create({}));

        return () => {
            webSocketClient.removeProtobuffListener(AchievementsCategoriesData, listener);
        }
    }, []);

    return value;
}
