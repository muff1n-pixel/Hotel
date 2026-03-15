import { RoomUser } from "@Client/Room/RoomInstance";
import { useEffect, useState } from "react";
import RoomUserFriendRequestMenu from "src/UserInterface/Components/Room/Users/Friends/RoomUserFriendRequestMenu";
import useFriends from "src/UserInterface/Hooks/useFriends";
import { useRoomInstance } from "src/UserInterface/Hooks/useRoomInstance";

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
