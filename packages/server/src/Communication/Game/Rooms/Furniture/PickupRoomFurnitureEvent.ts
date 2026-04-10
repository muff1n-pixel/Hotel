import { game } from "../../../../index.js";
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

        if(!roomFurniture.model.user) {
            return;
        }

        if(roomFurniture.model.userId !== user.model.id && !roomUser.hasRights()) {
            throw new Error("User is not owner of the furniture and does not have rights.");
        }

        await roomFurniture.pickup();

        if(roomFurniture.model.userId && roomFurniture.model.userId !== user.model.id) {
            await game.getUserNotifications(roomFurniture.model.userId).addNotification("furniture");
        }
    }
}
