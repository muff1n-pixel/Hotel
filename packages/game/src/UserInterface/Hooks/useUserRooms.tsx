import { useEffect, useState } from "react";
import { webSocketClient } from "../..";
import { GetUserRoomsData } from "@pixel63/events";
import { UserRoomData, UserRoomsData } from "@pixel63/events/build/Client/User/Rooms/UserRoomsData";

export function useUserRooms() {
    const [value, setValue] = useState<UserRoomData[]>([]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserRoomsData, {
            async handle(payload: UserRoomsData) {
                setValue(payload.rooms);
            },
        })

        webSocketClient.sendProtobuff(GetUserRoomsData, GetUserRoomsData.create({}));

        return () => {
            webSocketClient.removeProtobuffListener(UserRoomsData, listener);
        };
    }, []);

    return value;
}
