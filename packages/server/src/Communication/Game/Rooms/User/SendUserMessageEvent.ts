import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { SendUserMessageEventData } from "@shared/Communications/Requests/Rooms/User/SendUserMessageEventData.js";

export default class SendUserMessageEvent implements IncomingEvent<SendUserMessageEventData> {
    async handle(user: User, event: SendUserMessageEventData) {
        if(!user.room) {
            return;
        }

        if(event.message === ":sit") {
            const roomUser = user.room.getRoomUser(user);

            roomUser.addAction("Sit");
        }
        else if(event.message === ":wave") {
            const roomUser = user.room.getRoomUser(user);

            roomUser.addAction("Wave");
        }
    }
}
