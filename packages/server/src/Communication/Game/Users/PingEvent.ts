import { PingData } from "@pixel63/events";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class PingEvent implements ProtobuffListener<PingData> {
    public readonly name = "PingEvent";

    async handle(user: User) {
        user.sendProtobuff(PingData, PingData.create({}));
    }
}
