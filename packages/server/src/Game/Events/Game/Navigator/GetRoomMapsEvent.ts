import User from "../../../Users/User.js";
import { game } from "../../../index.js";
import { GetRoomMapsData, RoomMapsData } from "@pixel63/events";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";

export default class GetRoomMapsEvent implements UserProtobuffListener<GetRoomMapsData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User): Promise<void> {
        user.sendProtobuff(RoomMapsData, RoomMapsData.fromJSON({
            maps: game.roomNavigatorManager.maps.map((map) => map)
        }));
    }
}
