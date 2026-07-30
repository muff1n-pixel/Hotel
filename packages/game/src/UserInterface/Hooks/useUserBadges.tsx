import { useEffect, useState } from "react";
import { webSocketClient } from "../..";
import { BadgeData, GetUserBadgesData, GroupData, UserBadgesData } from "@pixel63/events";

export function useUserBadges(userId: string) {
    const [value, setValue] = useState<BadgeData[]>([]);
    const [group, setGroup] = useState<GroupData>();
    const [achievementScore, setAchievementScore] = useState<number>(0);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserBadgesData, {
            async handle(payload: UserBadgesData) {
                if(payload.userId === userId) {
                    setValue(payload.badges);
                    setGroup(payload.group);
                    setAchievementScore(payload.achievementScore);
                }
            },
        })

        webSocketClient.sendProtobuff(GetUserBadgesData, GetUserBadgesData.create({
            id: userId
        }));

        return () => {
            webSocketClient.removeProtobuffListener(UserBadgesData, listener);
        };
    }, [userId]);

    return {
        badges: value,
        group,
        achievementScore
    };
}
