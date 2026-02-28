import { UserEventData } from "@shared/Communications/Responses/User/UserEventData.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { UserData } from "@pixel63/events";

export default class GetUserEvent implements IncomingEvent {
    public readonly name = "GetUserEvent";

    async handle(user: User) {
        user.sendProto(UserData, UserData.fromObject(user.model));

        //user.send(new OutgoingEvent<UserEventData>("UserEvent", user.getUserData()));
    }
}
