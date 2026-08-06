import { GetRoomWiredMonitorData, RoomWiredMonitorData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener";
import User from "../../../Users/User";
import RoomServer from "../../../RoomServer";

export default class GetRoomWiredMonitorEvent implements RoomProtobuffListener<GetRoomWiredMonitorData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User) {
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
                        maxValue: RoomServer.hotelSettings.roomWiredMaxUsage
                    },
                    {
                        type: "floor_furni",
                        value: user.roomUser.room.floorFurnitureCount,
                        maxValue: RoomServer.hotelSettings.roomMaxFloorFurniture
                    },
                    {
                        type: "wall_furni",
                        value: user.roomUser.room.wallFurnitureCount,
                        maxValue: RoomServer.hotelSettings.roomMaxWallFurniture
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
