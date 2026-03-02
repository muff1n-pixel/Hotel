import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import { game } from "../../../index.js";
import { GetRoomMapsData, RoomMapsData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class GetRoomMapsEvent implements ProtobuffListener<GetRoomMapsData> {
    public readonly name = "GetRoomMapsEvent";

    async handle(user: User): Promise<void> {
        user.sendProtobuff(RoomMapsData, RoomMapsData.fromJSON({
            maps: game.roomNavigatorManager.maps.map((map) => map)
        }));
    }
}
