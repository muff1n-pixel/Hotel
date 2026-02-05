import { UserEventData } from "@shared/Communications/Responses/User/UserEventData.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { SetHomeRoomEventData } from "@shared/Communications/Requests/User/SetHomeRoomEventData.js";

export default class SetHomeRoomEvent implements IncomingEvent<SetHomeRoomEventData> {
    async handle(user: User, event: SetHomeRoomEventData) {
        user.model.homeRoomId = event.roomId;

        await user.model.save();

        user.send(new OutgoingEvent<UserEventData>("UserEvent", user.getUserData()));
    }
}
