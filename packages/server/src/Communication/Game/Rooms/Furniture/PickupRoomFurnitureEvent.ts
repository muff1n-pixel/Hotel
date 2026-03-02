import User from "../../../../Users/User.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { PickupRoomFurnitureData } from "@pixel63/events";

export default class PickupRoomFurnitureEvent implements ProtobuffListener<PickupRoomFurnitureData> {
    async handle(user: User, payload: PickupRoomFurnitureData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);
        const roomFurniture = user.room.getRoomFurniture(payload.id);

        if(roomFurniture.model.user.id !== user.model.id && !roomUser.hasRights()) {
            throw new Error("User is not owner of the furniture and does not have rights.");
        }

        await roomFurniture.pickup();
    }
}
