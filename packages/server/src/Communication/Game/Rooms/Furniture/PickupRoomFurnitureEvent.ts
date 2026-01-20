import { PlaceFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/PlaceFurnitureEventData";
import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { UpdateRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/UpdateRoomFurnitureEventData.js";
import OutgoingEvent from "../../../../Events/Interfaces/OutgoingEvent.js";
import { RoomFurnitureEventData } from "@shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData.js";
import { PickupRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/PickupRoomFurnitureEventData.js";

export default class PickupRoomFurnitureEvent implements IncomingEvent<PickupRoomFurnitureEventData> {
    async handle(user: User, event: PickupRoomFurnitureEventData) {
        if(!user.room) {
            return;
        }

        const roomFurniture = user.room.getRoomFurniture(event.roomFurnitureId);

        roomFurniture.pickup();
    }
}
