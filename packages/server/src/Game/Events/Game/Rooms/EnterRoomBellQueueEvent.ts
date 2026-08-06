import { EnterRoomBellQueueData, RoomBellQueueData, RoomBellQueueUserData, UpdateRoomBellQueueData } from "@pixel63/events";
import User from "../../../Users/User";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener";
import { game } from "../../..";
import UserRoomQueue from "../../../Users/Rooms/UserRoomQueue";

export default class EnterRoomBellQueueEvent implements UserProtobuffListener<EnterRoomBellQueueData> {
    minimumDurationBetweenEvents?: number = 10_000;

    async handle(user: User, payload: EnterRoomBellQueueData) {
        user.roomBellQueue?.cancel();

        user.roomBellQueue = new UserRoomQueue(user, payload.roomId);
    }
}
