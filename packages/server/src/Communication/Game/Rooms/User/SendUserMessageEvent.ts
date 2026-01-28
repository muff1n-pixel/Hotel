import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { SendUserMessageEventData } from "@shared/Communications/Requests/Rooms/User/SendUserMessageEventData.js";
import OutgoingEvent from "../../../../Events/Interfaces/OutgoingEvent.js";
import { UserChatEventData } from "@shared/Communications/Responses/Rooms/Users/UserChatEventData.js";

export default class SendUserMessageEvent implements IncomingEvent<SendUserMessageEventData> {
    async handle(user: User, event: SendUserMessageEventData) {
        if(!user.room) {
            return;
        }

        // TODO: implement proper command handling
        if(event.message === ":sit") {
            const roomUser = user.room.getRoomUser(user);

            roomUser.addAction("Sit");
        }
        else if(event.message === ":wave") {
            const roomUser = user.room.getRoomUser(user);

            roomUser.addAction("Wave");
        }
        else if(event.message.startsWith(":enable")) {
            const id = event.message.split(' ')[1];

            if(!id) {
                throw new Error("Missing enable id parameter.");
            }

            const roomUser = user.room.getRoomUser(user);

            roomUser.removeAction("AvatarEffect");
            
            roomUser.addAction("AvatarEffect." + parseInt(id));
        }
        else {
            user.room.sendRoomEvent(new OutgoingEvent<UserChatEventData>("UserChatEvent", {
                userId: user.model.id,
                message: event.message,
                roomChatStyleId: user.model.roomChatStyleId
            }));
        }
    }
}
