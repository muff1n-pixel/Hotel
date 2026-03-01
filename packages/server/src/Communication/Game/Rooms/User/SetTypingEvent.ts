import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { SetTypingEventData } from "@shared/Communications/Requests/Rooms/User/SetTypingEventData.js";
import OutgoingEvent from "../../../../Events/Interfaces/OutgoingEvent.js";
import { RoomUserData } from "@pixel63/events";

export default class SetTypingEvent implements IncomingEvent<SetTypingEventData> {
    public readonly name = "SetTypingEvent";

    async handle(user: User, event: SetTypingEventData) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }

        const roomUser = user.room.getRoomUser(user);

        if(roomUser.typing === event.typing) {
            return;
        }

        roomUser.typing = event.typing === true;

        user.room.sendProtobuff(RoomUserData, RoomUserData.create({
            id: user.model.id,
            typing: roomUser.typing
        }));
    }
}
