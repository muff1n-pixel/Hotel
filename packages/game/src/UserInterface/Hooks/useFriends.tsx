import { GetUserFriendsData, UserFriendData } from "@pixel63/events";
import { useEffect, useRef, useState } from "react";
import { clientInstance, webSocketClient } from "@Game/index";

export default function useFriends() {
    const friendsRequested = useRef<boolean>(false);

    const [friends, setFriends] = useState<UserFriendData[] | undefined>(clientInstance.friends.value);
    const [offlineFriends, setOfflineFriends] = useState<UserFriendData[] | undefined>(clientInstance.friends.value);

    const [incomingRequests, setIncomingRequests] = useState<UserFriendData[] | undefined>(clientInstance.incomingFriendRequests.value);
    const [outgoingRequests, setOutgoingRequests] = useState<UserFriendData[] | undefined>(clientInstance.outgoingFriendRequests.value);

    useEffect(() => {
        if (clientInstance.friends.value === undefined && !friendsRequested.current) {
            friendsRequested.current = true;

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