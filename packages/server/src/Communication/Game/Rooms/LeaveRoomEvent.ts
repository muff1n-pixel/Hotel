import { LeaveRoomData } from "@pixel63/events";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class LeaveRoomEvent implements ProtobuffListener<LeaveRoomData> {
    async handle(user: User) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }

        const roomUser = user.room.getRoomUser(user);

        roomUser.disconnect();
    }
}
