import { LeaveRoomData } from "@pixel63/events";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";
import User from "../../../Users/User.js";

export default class LeaveRoomEvent implements UserProtobuffListener<LeaveRoomData> {
    async handle(user: User) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }

        const roomUser = user.room.getRoomUser(user);

        roomUser.disconnect();
    }
}
