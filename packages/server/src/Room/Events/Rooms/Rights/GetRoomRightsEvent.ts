import { GetRoomRightsData, RoomRightsData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import User from "../../../Users/User.js";

export default class GetRoomRightsEvent implements RoomProtobuffListener<GetRoomRightsData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User, payload: GetRoomRightsData) {
        if(!user.roomUser.hasRights()) {
            return;
        }

        user.sendProtobuff(RoomRightsData, RoomRightsData.create({
            users: user.roomUser.room.model.rights.map((rights) => {
                return {
                    id: rights.user.id,
                    name: rights.user.name
                }
            })
        }));
    }
}
