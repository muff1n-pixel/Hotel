import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { game } from "../../../index.js";

export default class EnterHomeRoomEvent implements IncomingEvent {
    async handle(user: User, event: null) {
        if(user.room) {
            const roomUser = user.room.getRoomUser(user);

            roomUser.disconnect();
        }

        if(!user.model.homeRoomId) {
            return;
        }
        
        const roomInstance = await game.roomManager.getOrLoadRoomInstance(user.model.homeRoomId);

        if(!roomInstance) {
            console.error("Room does not exist.");

            return;
        }

        roomInstance.addUserClient(user);
    }
}
