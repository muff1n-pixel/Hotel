import User from "../../../../Game/Users/User.js";
import { PickupRoomFurnitureData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import RoomWebSocketUser from "../../../Server/Users/RoomWebSocketUser.js";

export default class PickupAllRoomFurnitureEvent implements RoomProtobuffListener<PickupRoomFurnitureData> {
    async handle(user: RoomWebSocketUser, payload: PickupRoomFurnitureData) {
        if(user.id !== user.roomUser.room.model.owner.id) {
            throw new Error("User does not own the room.");
        }

        for(const roomFurniture of user.roomUser.room.furnitures) {
            await roomFurniture.pickup(false);
        }

        user.roomUser.room.furnitures.length = 0;
    }
}
