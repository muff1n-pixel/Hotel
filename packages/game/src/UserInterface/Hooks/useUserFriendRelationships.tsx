import { useEffect, useState } from "react";
import { webSocketClient } from "../..";
import { GetUserFriendRelationshipsData, UserFriendRelationshipsData } from "@pixel63/events";

export function useUserFriendRelationships(userId: string) {
    const [value, setValue] = useState<UserFriendRelationshipsData>();

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserFriendRelationshipsData, {
            async handle(payload: UserFriendRelationshipsData) {
                if(payload.userId === userId) {
                    setValue(payload);
                }
            },
        })

        webSocketClient.sendProtobuff(GetUserFriendRelationshipsData, GetUserFriendRelationshipsData.create({
            userId
        }));

        return () => {
            webSocketClient.removeProtobuffListener(UserFriendRelationshipsData, listener);
        };
    }, [userId]);

    return value;
}
