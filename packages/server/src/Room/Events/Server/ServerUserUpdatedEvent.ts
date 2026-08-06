import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomServer from "../../RoomServer";
import { RoomUserData, ServerUserUpdatedData } from "@pixel63/events";

export default class ServerUserUpdatedEvent implements ServerProtobuffListener<ServerUserUpdatedData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(_: null, payload: ServerUserUpdatedData) {
        const user = RoomServer.users.find((user) => user.model.id === payload.userId);

        if(!user) {
            return;
        }

        await user.model.reload();

        user.room.sendProtobuff(RoomUserData, RoomUserData.create(user.roomUser.getRoomUserData()));
    }
}
