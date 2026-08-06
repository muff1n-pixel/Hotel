import { PickupRoomFurnitureData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener";
import User from "../../../Users/User";

export default class PickupRoomFurnitureEvent implements RoomProtobuffListener<PickupRoomFurnitureData> {
    async handle(user: User, payload: PickupRoomFurnitureData) {
        const roomFurniture = user.roomUser.room.getRoomFurniture(payload.id);

        if(!roomFurniture.model.user) {
            return;
        }

        if(roomFurniture.model.userId !== user.id && !user.roomUser.hasRights()) {
            throw new Error("User is not owner of the furniture and does not have rights.");
        }

        await roomFurniture.pickup();
    }
}
