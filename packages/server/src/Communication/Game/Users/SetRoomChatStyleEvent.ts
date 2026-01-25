import { UserEventData } from "@shared/Communications/Responses/User/UserEventData.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { SetRoomChatStyleEventData } from "@shared/Communications/Requests/User/SetRoomChatStyleEventData.js";

export default class SetRoomChatStyleEvent implements IncomingEvent<SetRoomChatStyleEventData> {
    async handle(user: User, event: SetRoomChatStyleEventData) {
        user.model.roomChatStyleId = event.id;

        await user.model.save();
    }
}
