import { webSocketClient } from "@Game/index";
import { GetRoomWiredLogsData, RoomWiredLogsData } from "@pixel63/events";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useCallback, useEffect, useState } from "react";

export default function useRoomWiredLogs(page: number, search: string, level: string) {
    const room = useRoomInstance();

    const [logs, setLogs] = useState<RoomWiredLogsData>();

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(RoomWiredLogsData, {
            async handle(payload: RoomWiredLogsData) {
                setLogs(payload);
            },
        });

        const timer = setInterval(() => {
            room?.websocket.sendProtobuff(GetRoomWiredLogsData, GetRoomWiredLogsData.create({}));
        }, 15 * 1000);

        room?.websocket.sendProtobuff(GetRoomWiredLogsData, GetRoomWiredLogsData.create({
            level,
            search,
            page
        }));

        return () => {
            clearInterval(timer);
            
            room?.websocket.removeProtobuffListener(RoomWiredLogsData, listener);
        };
    }, [room, page, search, level]);

    const handleRefresh = useCallback(() => {
        room?.websocket.sendProtobuff(GetRoomWiredLogsData, GetRoomWiredLogsData.create({
            level,
            search,
            page
        }));
    }, [room, level, search, page]);

    return {
        logs,
        handleRefresh
    };
}
