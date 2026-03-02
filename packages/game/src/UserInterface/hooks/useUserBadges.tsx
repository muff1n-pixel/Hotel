import { useEffect, useState } from "react";
import { webSocketClient } from "../..";
import { BadgeData, GetUserBadgesData, UserBadgesData } from "@pixel63/events";

export function useUserBadges(userId: string) {
    const [value, setValue] = useState<BadgeData[]>([]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserBadgesData, {
            async handle(payload: UserBadgesData) {
                if(payload.userId === userId) {
                    setValue(payload.badges);
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

    return value;
}
