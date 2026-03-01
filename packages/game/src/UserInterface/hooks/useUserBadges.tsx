import { useEffect, useState } from "react";
import { webSocketClient } from "../..";
import { GetUserProfileEventData } from "@Shared/Communications/Requests/Rooms/User/GetUserProfileEventData";
import { BadgeData, UserBadgesData } from "@pixel63/events";

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

        webSocketClient.send<GetUserProfileEventData>("GetUserProfileEvent", {
            userId
        });

        return () => {
            webSocketClient.removeProtobuffListener(UserBadgesData, listener);
        };
    }, [userId]);

    return value;
}
