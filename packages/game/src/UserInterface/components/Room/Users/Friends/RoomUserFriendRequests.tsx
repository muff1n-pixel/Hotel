import { RoomUser } from "@Client/Room/RoomInstance";
import { useEffect, useState } from "react";
import RoomUserFriendRequestMenu from "src/UserInterface/Components/Room/Users/Friends/RoomUserFriendRequestMenu";
import { useRoomInstance } from "src/UserInterface/Hooks/useRoomInstance";

export default function RoomUserFriendRequests() {
    const room = useRoomInstance();

    const [users, setUsers] = useState<RoomUser[]>([]);

    useEffect(() => {
        if(room) {
            setUsers(room.users);
        }
    }, [room]);

    return users.map((user) => (
        <RoomUserFriendRequestMenu user={user}/>
    ));
}
