import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { PickupRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/PickupRoomFurnitureEventData.js";

export default class PickupRoomFurnitureEvent implements IncomingEvent<PickupRoomFurnitureEventData> {
    public readonly name = "PickupRoomFurnitureEvent";

    async handle(user: User, event: PickupRoomFurnitureEventData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);
        const roomFurniture = user.room.getRoomFurniture(event.roomFurnitureId);

        if(roomFurniture.model.user.id !== user.model.id && !roomUser.hasRights()) {
            throw new Error("User is not owner of the furniture and does not have rights.");
        }

        await roomFurniture.pickup();
    }
}
