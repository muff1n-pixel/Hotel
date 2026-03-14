import { GetUserFriendsData, UserFriendData } from "@pixel63/events";
import { useEffect, useState } from "react";
import { clientInstance, webSocketClient } from "src";

export default function useFriends() {
    const [friends, setFriends] = useState<UserFriendData[] | undefined>(clientInstance.friends.value);
    const [incomingRequests, setIncomingRequests] = useState<UserFriendData[] | undefined>(clientInstance.incomingFriendRequests.value);
    const [outgoingRequests, setOutgoingRequests] = useState<UserFriendData[] | undefined>(clientInstance.outgoingFriendRequests.value);

    useEffect(() => {
        if (clientInstance.friends.value === undefined) {
            webSocketClient.sendProtobuff(GetUserFriendsData, GetUserFriendsData.create({}));
        }

        const listeners = [
            clientInstance.friends.subscribe(setFriends),
            clientInstance.incomingFriendRequests.subscribe(setIncomingRequests),
            clientInstance.outgoingFriendRequests.subscribe(setOutgoingRequests),
        ];

        return () => listeners.forEach((listener) => listener());
    }, []);

    return { friends, incomingRequests, outgoingRequests };
}