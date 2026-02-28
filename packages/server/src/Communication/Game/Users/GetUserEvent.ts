import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { UserData } from "@pixel63/events";

export default class GetUserEvent implements IncomingEvent {
    public readonly name = "GetUserEvent";

    async handle(user: User) {
        user.sendUserData();
    }
}
