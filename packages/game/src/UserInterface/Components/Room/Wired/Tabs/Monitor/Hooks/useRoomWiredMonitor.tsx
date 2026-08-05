import { webSocketClient } from "@Game/index";
import { GetRoomWiredMonitorData, RoomWiredMonitorData } from "@pixel63/events";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useCallback, useEffect, useState } from "react";

export default function useRoomWiredMonitor() {
    const room = useRoomInstance();

    const [monitor, setMonitor] = useState<RoomWiredMonitorData>();

    useEffect(() => {
        const listener = room?.websocket.addProtobuffListener(RoomWiredMonitorData, {
            async handle(payload: RoomWiredMonitorData) {
                setMonitor(payload);
            },
        });

        const timer = setInterval(() => {
            room?.websocket.sendProtobuff(GetRoomWiredMonitorData, GetRoomWiredMonitorData.create({}));
        }, 15 * 1000);

        room?.websocket.sendProtobuff(GetRoomWiredMonitorData, GetRoomWiredMonitorData.create({}));

        return () => {
            clearInterval(timer);
            
            room?.websocket.removeProtobuffListener(RoomWiredMonitorData, listener);
        };
    }, [ room ]);

    const handleRefresh = useCallback(() => {
        room?.websocket.sendProtobuff(GetRoomWiredMonitorData, GetRoomWiredMonitorData.create({}));
    }, [ room ]);

    return {
        monitor,
        handleRefresh
    };
}
