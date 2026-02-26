import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { UseRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData.js";

export default class UseRoomFurnitureEvent implements IncomingEvent<UseRoomFurnitureEventData> {
    public readonly name = "UseRoomFurnitureEvent";

    async handle(user: User, event: UseRoomFurnitureEventData) {
        if(!user.room) {
            return;
        }

        let roomUser = user.room.getRoomUser(user);
        const roomFurniture = user.room.getRoomFurniture(event.roomFurnitureId);

        const logic = roomFurniture.getCategoryLogic();

        if(logic) {
            await logic.use?.(roomUser, event);
        }
    }
}
