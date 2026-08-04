import { GetRoomWiredMonitorData, RoomWiredMonitorData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import User from "../../../../Users/User.js";
import { game } from "../../../../index.js";

export default class GetRoomWiredMonitorEvent implements ProtobuffListener<GetRoomWiredMonitorData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(!roomUser.hasRights()) {
            return;
        }

        const room = user.room;

        user.sendProtobuff(RoomWiredMonitorData, RoomWiredMonitorData.create({
            roomId: user.room.model.id,

            statistics: {
                heavy: false,

                variables: [
                    {
                        type: "wired_usage",
                        value: room.wired.executions.length,
                        maxValue: game.hotelSettings.roomWiredMaxUsage
                    },
                    {
                        type: "floor_furni",
                        value: room.floorFurnitureCount,
                        maxValue: game.hotelSettings.roomMaxFloorFurniture
                    },
                    {
                        type: "wall_furni",
                        value: room.wallFurnitureCount,
                        maxValue: game.hotelSettings.roomMaxWallFurniture
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

            logs: roomUser.room.wired.getLogCategories().map((log) => ({
                category: log.category,
                level: log.level,
                amount: log.amount,
                latestOccurrence: log.latestTimestamp
            }))
        }));
    }
}
