import { ServerUserUpdatedData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import { game } from "../..";
import RoomWorker from "../../Rooms/RoomWorker";

export default class ServerUserUpdatedEvent implements ServerProtobuffListener<ServerUserUpdatedData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(server: RoomWorker, payload: ServerUserUpdatedData) {
        const user = game.getUserById(payload.userId);

        if(user) {
            await user.model.reload();

            user.sendUserData();
        }
    }
}
