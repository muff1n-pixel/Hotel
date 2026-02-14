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

        const roomUser = user.room.getRoomUser(user);

        if(event.message.includes(":)")) {
            roomUser.addAction("GestureSmile");
        }
        else if(event.message.includes(":D")) {
            roomUser.addAction("Laugh");
        }
        else if(event.message.includes(":(")) {
            roomUser.addAction("GestureSad");
        }
        else if(event.message.includes(":@")) {
            roomUser.addAction("GestureAngry");
        }
        else if(event.message.toLowerCase().includes(":o")) {
            roomUser.addAction("GestureSurprised");
        }

        // TODO: implement proper command handling
        if(event.message === ":sit") {
            roomUser.addAction("Sit");
        }
        else if(event.message === ":wave") {
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
        else if(event.message.startsWith(":speed")) {
            const roomUser = user.room.getRoomUser(user);

            if(!roomUser.hasRights()) {
                this.sendRoomMessage(user, event);
                
                return;
            }

            const scaleInput = event.message.split(' ')[1];

            if(!scaleInput) {
                this.sendRoomMessage(user, event);

                return;
            }

            const scale = Math.max(0, Math.min(2, parseFloat(scaleInput)));

            user.room.model.speed = scale;

            if(user.room.model.changed()) {
                await user.room.model.save();
            }
        }
        else {
            this.sendRoomMessage(user, event);
        }
    }

    private sendRoomMessage(user: User, event: SendUserMessageEventData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        user.room.sendRoomEvent(new OutgoingEvent<UserChatEventData>("UserChatEvent", {
            userId: user.model.id,
            message: event.message,
            roomChatStyleId: user.model.roomChatStyleId
        }));

        roomUser.addAction("Talk", Math.max(800, event.message.length * 60));
    }
}
