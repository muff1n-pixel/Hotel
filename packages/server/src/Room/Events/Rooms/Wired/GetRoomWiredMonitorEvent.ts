import { GetRoomWiredMonitorData, RoomWiredMonitorData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener";
import RoomWebSocketUser from "../../../Server/Users/RoomWebSocketUser";
import { roomServer } from "../../..";

export default class GetRoomWiredMonitorEvent implements RoomProtobuffListener<GetRoomWiredMonitorData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: RoomWebSocketUser) {
        if(!user.roomUser.hasRights()) {
            return;
        }

        user.sendProtobuff(RoomWiredMonitorData, RoomWiredMonitorData.create({
            roomId: user.roomUser.room.model.id,

            statistics: {
                heavy: false,

                variables: [
                    {
                        type: "wired_usage",
                        value: user.roomUser.room.wired.executions.length,
                        maxValue: roomServer.hotelSettings.roomWiredMaxUsage
                    },
                    {
                        type: "floor_furni",
                        value: user.roomUser.room.floorFurnitureCount,
                        maxValue: roomServer.hotelSettings.roomMaxFloorFurniture
                    },
                    {
                        type: "wall_furni",
                        value: user.roomUser.room.wallFurnitureCount,
                        maxValue: roomServer.hotelSettings.roomMaxWallFurniture
                    },
                    {
                        type: "permanent_furni_vars",
                        value: 0,
                        maxValue: 18
                    },
                    {
                        type: "permanent_user_vars",
                        value: 0,
                        maxValue: 18
                    },
                    {
                        type: "permanent_global_vars",
                        value: 0,
                        maxValue: 18
                    }
                ]
            },

            logs: user.roomUser.room.wired.getLogCategories().map((log) => ({
                category: log.category,
                level: log.level,
                amount: log.amount,
                latestOccurrence: log.latestTimestamp
            }))
        }));
    }
}
