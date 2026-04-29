import { useEffect, useRef, useState } from "react";
import { webSocketClient } from "../../../../../..";
import { GetRoomMapsData, RoomMapData, RoomMapsData } from "@pixel63/events";

export default function useRoomMaps() {
    const roomMapsRequested = useRef(false);

    const [roomMaps, setRoomMaps] = useState<RoomMapData[]>([]);

    useEffect(() => {
        if(roomMapsRequested.current) {
            return;
        }

        roomMapsRequested.current = true;

        webSocketClient.addProtobuffListener(RoomMapsData, {
            async handle(payload: RoomMapsData) {
                setRoomMaps(payload.maps);
            },
        }, {
            once: true
        });

        webSocketClient.sendProtobuff(GetRoomMapsData, GetRoomMapsData.create({}));
    }, []);

    return roomMaps;
}
