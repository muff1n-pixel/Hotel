import { AchievementData, AchievementsData, GetAchievementsData } from "@pixel63/events";
import { useEffect, useRef, useState } from "react";
import { webSocketClient } from "@Game/index";

export function useAchievements(categoryId: string) {
    const requested = useRef<string>(undefined);

    const [value, setValue] = useState<AchievementData[]>();

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(AchievementsData, {
            async handle(payload: AchievementsData) {
                if(payload.categoryId === categoryId) {
                    setValue(payload.achievements);
                }
            },
        });

        if(requested.current !== categoryId) {
            requested.current = categoryId;
            
            webSocketClient.sendProtobuff(GetAchievementsData, GetAchievementsData.create({
                categoryId
            }));
        }

        return () => {
            webSocketClient.removeProtobuffListener(AchievementsData, listener);
        }
    }, [categoryId]);

    return value;
}
