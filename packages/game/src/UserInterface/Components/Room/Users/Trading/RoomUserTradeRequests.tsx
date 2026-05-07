import { RoomUser } from "@Client/Room/RoomInstance";
import { useEffect, useState } from "react";
import { useRoom } from "@UserInterface/Hooks/useRoom";
import { webSocketClient } from "@Game/index";
import { RoomUserLeftData, RoomUserTradingRequestData } from "@pixel63/events";
import RoomUserTradeRequestMenu from "@UserInterface/Components/Room/Users/Trading/RoomUserTradeRequestMenu";

export default function RoomUserTradeRequests() {
    const { room } = useRoom();

    const [users, setUsers] = useState<RoomUser[]>([]);

    useEffect(() => {
        const roomUserTradingRequestListener = webSocketClient.addProtobuffListener(RoomUserTradingRequestData, {
            async handle(payload: RoomUserTradingRequestData) {
                if(!room || !payload.userId) {
                    return;
                }

                const roomUser = room.getUserById(payload.userId);

                setUsers([...users, roomUser]);
            },
        });

        const roomUserLeftListener = webSocketClient.addProtobuffListener(RoomUserLeftData, {
            async handle(payload: RoomUserLeftData) {
                setUsers(users.filter((user) => user.data.id !== payload.userId));
            },
        });

        return () => {
            webSocketClient.removeProtobuffListener(RoomUserLeftData, roomUserLeftListener);
            webSocketClient.removeProtobuffListener(RoomUserTradingRequestData, roomUserTradingRequestListener);
        };
    }, [room, users]);

    return users.map((user) => (
        <RoomUserTradeRequestMenu user={user} onClose={() => {
            setUsers(users.filter((_user) => _user.data.id !== user.data.id));
        }}/>
    ));
}
