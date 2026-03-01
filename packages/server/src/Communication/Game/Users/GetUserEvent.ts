import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { GetUserData, UserData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class GetUserEvent implements ProtobuffListener<GetUserData> {
    public readonly name = "GetUserEvent";

    async handle(user: User) {
        user.sendUserData();
    }
}
