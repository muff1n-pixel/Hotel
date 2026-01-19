import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { EnterRoomEventData } from "@shared/Communications/Requests/Rooms/EnterRoomEventData.js";
import { game } from "../../../index.js";

export default class EnterRoomEvent implements IncomingEvent<EnterRoomEventData> {
    async handle(user: User, event: EnterRoomEventData) {
        const roomInstance = await game.roomManager.getOrLoadRoomInstance(event.roomId);

        if(!roomInstance) {
            console.error("Room does not exist.");

            return;
        }

        roomInstance.addUserClient(user);
    }
}
