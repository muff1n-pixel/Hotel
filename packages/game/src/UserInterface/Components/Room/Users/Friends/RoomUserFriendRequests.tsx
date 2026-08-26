import { useEffect, useState } from "react";
import RoomUserFriendRequestMenu from "@UserInterface/Components/Room/Users/Friends/RoomUserFriendRequestMenu";
import useFriends from "@UserInterface/Hooks/useFriends";
import { useRoom } from "@UserInterface/Hooks/useRoom";
import RoomUser from "@Client/Room/Users/RoomUser";

export default function RoomUserFriendRequests() {
    const { room, roomState } = useRoom();
    const { incomingRequests } = useFriends();

    const [users, setUsers] = useState<RoomUser[]>([]);

    useEffect(() => {
        if(room) {
            setUsers(room.users.filter((user) => incomingRequests?.some((request) => request.id === user.data.id)));
        }
    }, [room, roomState, incomingRequests]);

    return users.map((user) => (
        <RoomUserFriendRequestMenu user={user}/>
    ));
}
