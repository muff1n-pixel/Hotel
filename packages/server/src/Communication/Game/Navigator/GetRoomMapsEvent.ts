import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import { game } from "../../../index.js";
import { RoomMapsData } from "@pixel63/events";

export default class GetRoomMapsEvent implements IncomingEvent {
    public readonly name = "GetRoomMapsEvent";

    async handle(user: User): Promise<void> {
        user.sendProtobuff(RoomMapsData, RoomMapsData.create({
            maps: game.roomNavigatorManager.maps.map((map) => map.toJSON())
        }));
    }
}
