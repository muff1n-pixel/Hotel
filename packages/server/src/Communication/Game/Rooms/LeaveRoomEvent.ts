import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";

export default class LeaveRoomEvent implements IncomingEvent {
    async handle(user: User, event: null) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }

        const roomUser = user.room.getRoomUser(user);

        roomUser.disconnect();
    }
}
