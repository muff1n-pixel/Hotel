import { UserFriendData } from "@pixel63/events";
import { useEffect, useState } from "react";
import useFriends from "src/UserInterface/Hooks/useFriends";

export default function useIncomingFriendRequest(userId: string) {
    const { incomingRequests } = useFriends();

    const [incomingRequest, setIncomingRequest] = useState<UserFriendData | null>();

    useEffect(() => {
        setIncomingRequest(incomingRequests?.find((request) => request.id === userId));
    }, [incomingRequests]);

    return incomingRequest
}