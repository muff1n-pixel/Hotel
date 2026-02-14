import { useEffect, useState } from "react";
import { webSocketClient } from "../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { GetUserProfileEventData } from "@Shared/Communications/Requests/Rooms/User/GetUserProfileEventData";
import { UserProfileEventData } from "@Shared/Communications/Responses/Rooms/Users/UserProfileEventData";

export function useUserProfile(userId: string) {
    const [value, setValue] = useState<UserProfileEventData | null>(null);

    useEffect(() => {
        const listener = (event: WebSocketEvent<UserProfileEventData>) => {
            if (event.data.userId === userId) {
                setValue(event.data);
            }
        };

        webSocketClient.addEventListener<WebSocketEvent<UserProfileEventData>>("UserProfileEvent", listener);

        webSocketClient.send<GetUserProfileEventData>("GetUserProfileEvent", {
            userId
        });

        return () => {
            webSocketClient.removeEventListener<WebSocketEvent<UserProfileEventData>>("UserProfileEvent", listener);
        };
    }, [userId]);

    return value;
}
