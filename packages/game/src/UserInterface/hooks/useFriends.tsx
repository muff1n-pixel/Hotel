import { GetUserFriendsData, UserFriendData } from "@pixel63/events";
import { useEffect, useState } from "react";
import { clientInstance, webSocketClient } from "src";

export default function useFriends() {
    const [friends, setFriends] = useState<UserFriendData[] | undefined>(clientInstance.friends.value);
    const [offlineFriends, setOfflineFriends] = useState<UserFriendData[] | undefined>(clientInstance.friends.value);

    const [incomingRequests, setIncomingRequests] = useState<UserFriendData[] | undefined>(clientInstance.incomingFriendRequests.value);
    const [outgoingRequests, setOutgoingRequests] = useState<UserFriendData[] | undefined>(clientInstance.outgoingFriendRequests.value);

    useEffect(() => {
        if (clientInstance.friends.value === undefined) {
            webSocketClient.sendProtobuff(GetUserFriendsData, GetUserFriendsData.create({}));
        }

        const listeners = [
            clientInstance.friends.subscribe((friends) => {
                setFriends(friends?.filter((friend) => friend.online));

                setOfflineFriends(friends?.filter((friend) => !friend.online));
            }),
            clientInstance.incomingFriendRequests.subscribe((value) => {
                if(value){
                    setIncomingRequests([...value!]);
                }
            }),
            clientInstance.outgoingFriendRequests.subscribe((value) => {
                if(value) {
                    setOutgoingRequests([...value]);
                }
            }),
        ];

        return () => listeners.forEach((listener) => listener());
    }, []);

    return {
        friends,
        offlineFriends,
        
        incomingRequests,
        outgoingRequests
    };
}