import User from "../../../../Users/User.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { SendRoomUserWalkData } from "@pixel63/events";

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
            roomUser.path.teleportTo(payload.target);
        }
        else {
            roomUser.path.walkTo(payload.target);
        }
    }
}
