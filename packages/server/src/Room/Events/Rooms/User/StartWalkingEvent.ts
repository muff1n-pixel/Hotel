import { RoomPositionOffsetData, SendRoomUserWalkData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener";
import User from "../../../Users/User";

export default class StartWalkingEvent implements RoomProtobuffListener<SendRoomUserWalkData> {
    async handle(user: User, payload: SendRoomUserWalkData) {
        if(!payload.target) {
            throw new Error();
        }

        if(user.roomUser.teleporting) {
            user.roomUser.path.teleportTo(RoomPositionOffsetData.fromJSON(payload.target));
        }
        else {
            user.roomUser.path.walkTo(RoomPositionOffsetData.fromJSON(payload.target));
        }
    }
}
