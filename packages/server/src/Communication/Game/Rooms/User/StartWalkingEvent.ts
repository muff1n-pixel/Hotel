import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { StartWalkingEventData } from "@shared/Communications/Requests/Rooms/User/StartWalkingEventData.js";

export default class StartWalkingEvent implements IncomingEvent<StartWalkingEventData> {
    public readonly name = "StartWalkingEvent";

    async handle(user: User, event: StartWalkingEventData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(roomUser.teleporting) {
            roomUser.teleportTo(event.target);
        }
        else {
            roomUser.walkTo(event.target);
        }
    }
}
