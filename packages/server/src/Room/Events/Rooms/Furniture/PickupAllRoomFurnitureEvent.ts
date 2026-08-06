import { PickupRoomFurnitureData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import User from "../../../Users/User.js";

export default class PickupAllRoomFurnitureEvent implements RoomProtobuffListener<PickupRoomFurnitureData> {
    async handle(user: User, payload: PickupRoomFurnitureData) {
        if(user.id !== user.roomUser.room.model.owner.id) {
            throw new Error("User does not own the room.");
        }

        for(const roomFurniture of user.roomUser.room.furnitures) {
            await roomFurniture.pickup(false);
        }

        user.roomUser.room.furnitures.length = 0;
    }
}
