import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { SetRoomChatStyleEventData } from "@shared/Communications/Requests/User/SetRoomChatStyleEventData.js";

export default class SetRoomChatStyleEvent implements IncomingEvent<SetRoomChatStyleEventData> {
    public readonly name = "SetRoomChatStyleEvent";

    async handle(user: User, event: SetRoomChatStyleEventData) {
        user.model.roomChatStyleId = event.id;

        await user.model.save();
    }
}
