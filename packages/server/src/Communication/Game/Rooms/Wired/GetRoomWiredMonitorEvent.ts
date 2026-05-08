import { GetRoomWiredMonitorData, RoomWiredMonitorData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import User from "../../../../Users/User.js";

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

        user.sendProtobuff(RoomWiredMonitorData, RoomWiredMonitorData.create({
            roomId: user.room.model.id,

            statistics: {
                heavy: false,

                variables: [
                    {
                        type: "wired_usage",
                        value: 0,
                        maxValue: 3125
                    },
                    {
                        type: "floor_furni",
                        value: 0,
                        maxValue: 4000
                    },
                    {
                        type: "wall_furni",
                        value: 0,
                        maxValue: 4000
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

            logs: []
        }));
    }
}
