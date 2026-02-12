import { UserEventData } from "@shared/Communications/Responses/User/UserEventData.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";

export default class PingEvent implements IncomingEvent {
    async handle(user: User) {
        user.send(new OutgoingEvent("Ping", null));
    }
}
