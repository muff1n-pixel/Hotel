import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { UpdateRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/UpdateRoomFurnitureEventData.js";
import OutgoingEvent from "../../../../Events/Interfaces/OutgoingEvent.js";
import { RoomFurnitureEventData } from "@shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData.js";

export default class UpdateRoomFurnitureEvent implements IncomingEvent<UpdateRoomFurnitureEventData> {
    public readonly name = "UpdateRoomFurnitureEvent";

    async handle(user: User, event: UpdateRoomFurnitureEventData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(!roomUser.hasRights()) {
            throw new Error("User does not have rights.");
        }

        const roomFurniture = user.room.getRoomFurniture(event.roomFurnitureId);

        if(event.direction !== undefined) {
            if(event.position === undefined) {
                roomFurniture.setDirection(event.direction);
            }
            else {
                roomFurniture.model.direction = event.direction;
            }
        }

        if(event.position !== undefined) {
            roomFurniture.setPosition(event.position, false);
        }

        if(event.color !== undefined && roomFurniture.model.furniture.interactionType === "postit") {
            roomFurniture.model.color = event.color;
        }

        await roomFurniture.model.save();

        user.room.sendRoomEvent(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
            furnitureUpdated: [
                roomFurniture.getFurnitureData()
            ]
        }));
    }
}
