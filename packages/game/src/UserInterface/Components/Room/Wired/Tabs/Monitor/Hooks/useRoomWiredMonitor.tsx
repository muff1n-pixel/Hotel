import { webSocketClient } from "@Game/index";
import { GetRoomWiredMonitorData, RoomWiredMonitorData } from "@pixel63/events";
import { useEffect, useState } from "react";

export default function useRoomWiredMonitor() {
    const [monitor, setMonitor] = useState<RoomWiredMonitorData>();

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(RoomWiredMonitorData, {
            async handle(payload: RoomWiredMonitorData) {
                setMonitor(payload);
            },
        });

        const timer = setInterval(() => {
            webSocketClient.sendProtobuff(GetRoomWiredMonitorData, GetRoomWiredMonitorData.create({}));
        }, 15 * 1000);

        webSocketClient.sendProtobuff(GetRoomWiredMonitorData, GetRoomWiredMonitorData.create({}));

        return () => {
            clearInterval(timer);
            
            webSocketClient.removeProtobuffListener(RoomWiredMonitorData, listener);
        };
    }, []);

    return monitor;
}
