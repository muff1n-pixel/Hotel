import { GetRoomRightsData } from "@pixel63/events";
import { useEffect, useState } from "react";
import { webSocketClient } from "@Game/index";
import { RoomRightsData, RoomUserRightsData } from "@pixel63/events/build/Room/Rights/RoomRightsData";

export default function useRoomRights(roomId?: string) {
    const [users, setUsers] = useState<RoomUserRightsData[]>([]);

    useEffect(() => {
        if(!roomId) {
            return;
        }
        
        const listener = webSocketClient.addProtobuffListener(RoomRightsData, {
            async handle(payload: RoomRightsData) {
                setUsers(payload.users);
            },
        });

        webSocketClient.sendProtobuff(GetRoomRightsData, GetRoomRightsData.create({}));

        return () => {
            webSocketClient.removeProtobuffListener(RoomRightsData, listener);
        };
    }, [roomId]);

    return users;
}
