import { EnterRoomBellQueueData, ExitRoomBellQueueData, RoomBellQueueData, RoomBellQueueUserData } from "@pixel63/events";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener";
import User from "../../../Users/User";
import { game } from "../../..";

export default class LeaveRoomBellQueueEvent implements UserProtobuffListener<ExitRoomBellQueueData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: ExitRoomBellQueueData) {
        user.roomBellQueue?.cancel();
    }
}
