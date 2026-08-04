import { GetRoomRightsData, GetRoomWiredMonitorData, RoomRightsData, RoomWiredLogsData, RoomWiredMonitorData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import User from "../../../../Users/User.js";

export default class GetRoomRightsEvent implements ProtobuffListener<GetRoomRightsData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User, payload: GetRoomRightsData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(!roomUser.hasRights()) {
            return;
        }

        user.sendProtobuff(RoomRightsData, RoomRightsData.create({
            users: user.room.model.rights.map((rights) => {
                return {
                    id: rights.user.id,
                    name: rights.user.name
                }
            })
        }));
    }
}
