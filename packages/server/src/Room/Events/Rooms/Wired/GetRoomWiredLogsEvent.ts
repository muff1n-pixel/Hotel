import { GetRoomWiredLogsData, RoomWiredLogsData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener";
import RoomWebSocketUser from "../../../Server/Users/RoomWebSocketUser";

export default class GetRoomWiredLogsEvent implements RoomProtobuffListener<GetRoomWiredLogsData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: RoomWebSocketUser, payload: GetRoomWiredLogsData) {
        if(!user.roomUser.hasRights()) {
            return;
        }

        let filteredLogs = user.roomUser.room.wired.logs;

        if(payload.level) {
            filteredLogs = filteredLogs.filter((log) => log.level === payload.level);
        }

        if(payload.search?.length) {
            const lowerCasedSearch = payload.search.toLowerCase();

            filteredLogs = filteredLogs.filter((log) => log.message.toLowerCase().includes(lowerCasedSearch));
        }

        filteredLogs.reverse();

        const logsPerPage = 20;

        user.sendProtobuff(RoomWiredLogsData, RoomWiredLogsData.create({
            roomId: user.roomUser.room.model.id,

            logs: filteredLogs.slice(payload.page * logsPerPage, Math.min((payload.page * logsPerPage) + logsPerPage, filteredLogs.length)).map((log) => ({
                category: log.category,
                level: log.level,
                message: log.message,
                timestamp: log.timestamp
            })),

            maxPages: Math.floor(filteredLogs.length / logsPerPage)
        }));
    }
}
