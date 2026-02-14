import { useEffect, useState } from "react";
import { webSocketClient } from "../..";
import { UserBadgeData } from "@Shared/Interfaces/User/UserBadgeData";
import { UserBadgesEventData } from "@Shared/Communications/Responses/Rooms/Users/UserBadgesEventData";
import { GetUserBadgesEventData } from "@Shared/Communications/Requests/Rooms/User/GetUserBadgesEventData";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";

export function useUserBadges(userId: string) {
    const [value, setValue] = useState<UserBadgeData[]>([]);

    useEffect(() => {
        const listener = (event: WebSocketEvent<UserBadgesEventData>) => {
            if (event.data.userId === userId) {
                setValue(event.data.badges);
            }
        };

        webSocketClient.addEventListener<WebSocketEvent<UserBadgesEventData>>("UserBadgesEvent", listener);

        webSocketClient.send<GetUserBadgesEventData>("GetUserBadgesEvent", {
            userId
        });

        return () => {
            webSocketClient.removeEventListener<WebSocketEvent<UserBadgesEventData>>("UserBadgesEvent", listener);
        };
    }, [userId]);

    return value;
}
