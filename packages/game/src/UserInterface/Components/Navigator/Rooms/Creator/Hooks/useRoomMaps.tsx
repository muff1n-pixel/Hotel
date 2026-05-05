import { useEffect, useRef, useState } from "react";
import { webSocketClient } from "../../../../../..";
import { GetRoomMapsData, RoomMapData, RoomMapsData } from "@pixel63/events";

export default function useRoomMaps() {
    const roomMapsRequested = useRef(false);

    const [roomMaps, setRoomMaps] = useState<RoomMapData[]>([]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(RoomMapsData, {
            async handle(payload: RoomMapsData) {
                setRoomMaps(payload.maps);
            },
        });

        if(roomMapsRequested.current) {
            return () => {
                webSocketClient.removeProtobuffListener(RoomMapsData, listener);
            };
        }

        roomMapsRequested.current = true;

        webSocketClient.sendProtobuff(GetRoomMapsData, GetRoomMapsData.create({}));
    
        return () => {
            webSocketClient.removeProtobuffListener(RoomMapsData, listener);
        };
    }, []);

    return roomMaps;
}
