import User from "../../../../Game/Users/User.js";
import ProtobuffListener from "../../../../Game/Events/Interfaces/UserProtobuffListener.js";
import { RoomPositionOffsetData, SendRoomUserWalkData } from "@pixel63/events";

export default class StartWalkingEvent implements ProtobuffListener<SendRoomUserWalkData> {
    async handle(user: User, payload: SendRoomUserWalkData) {
        if(!user.room) {
            return;
        }

        if(!payload.target) {
            throw new Error();
        }

        const roomUser = user.room.getRoomUser(user);

        if(roomUser.teleporting) {
            roomUser.path.teleportTo(RoomPositionOffsetData.fromJSON(payload.target));
        }
        else {
            roomUser.path.walkTo(RoomPositionOffsetData.fromJSON(payload.target));
        }
    }
}
