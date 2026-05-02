import User from "../../../../Users/User.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { PickupRoomFurnitureData } from "@pixel63/events";

export default class PickupAllRoomFurnitureEvent implements ProtobuffListener<PickupRoomFurnitureData> {
    async handle(user: User, payload: PickupRoomFurnitureData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(user.model.id !== roomUser.room.model.owner.id) {
            throw new Error("User does not own the room.");
        }

        for(const roomFurniture of roomUser.room.furnitures) {
            await roomFurniture.pickup();
        }
    }
}
