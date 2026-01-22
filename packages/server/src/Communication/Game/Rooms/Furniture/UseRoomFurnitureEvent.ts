import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import OutgoingEvent from "../../../../Events/Interfaces/OutgoingEvent.js";
import { RoomFurnitureEventData } from "@shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData.js";
import { UseRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData.js";

export default class UseRoomFurnitureEvent implements IncomingEvent<UseRoomFurnitureEventData> {
    async handle(user: User, event: UseRoomFurnitureEventData) {
        if(!user.room) {
            return;
        }

        const roomFurniture = user.room.getRoomFurniture(event.roomFurnitureId);

        switch(roomFurniture.model.furniture.category) {
            case "gate":
                if(user.room.users.some(({ position }) => user.room?.isPositionInFurniture(roomFurniture, position))) {
                    break;
                }

                roomFurniture.model.animation = event.animation;

                break;

            case "lighting":
                roomFurniture.model.animation = event.animation;

                break;

            default:
                console.log("Unhandled furniture category for UseRoomFurnitureEvent", roomFurniture.model.furniture.category);
                
                roomFurniture.model.animation = event.animation;
                break;
        }

        if(roomFurniture.model.changed()) {
            await roomFurniture.model.save();

            user.room.sendRoomEvent(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
                furnitureUpdated: [
                    roomFurniture.getFurnitureData()
                ]
            }));
        }
    }
}
