import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { SetHomeRoomEventData } from "@shared/Communications/Requests/User/SetHomeRoomEventData.js";

export default class SetHomeRoomEvent implements IncomingEvent<SetHomeRoomEventData> {
    public readonly name = "SetHomeRoomEvent";

    async handle(user: User, event: SetHomeRoomEventData) {
        user.model.homeRoomId = event.roomId;

        await user.model.save();

        user.sendUserData();
    }
}
