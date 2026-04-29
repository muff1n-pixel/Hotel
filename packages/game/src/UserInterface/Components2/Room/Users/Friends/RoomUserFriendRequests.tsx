import { RoomUser } from "@Client/Room/RoomInstance";
import { useEffect, useState } from "react";
import RoomUserFriendRequestMenu from "@UserInterface/Components2/Room/Users/Friends/RoomUserFriendRequestMenu";
import useFriends from "@UserInterface/Hooks/useFriends";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function RoomUserFriendRequests() {
    const room = useRoomInstance();
    const { incomingRequests } = useFriends();

    const [users, setUsers] = useState<RoomUser[]>([]);

    useEffect(() => {
        if(room) {
            setUsers(room.users.filter((user) => incomingRequests?.some((request) => request.id === user.data.id)));
        }
    }, [room, incomingRequests]);

    return users.map((user) => (
        <RoomUserFriendRequestMenu user={user}/>
    ));
}
