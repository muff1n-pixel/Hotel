import { RoomClickEventData } from "@shared/Communications/Requests/Rooms/RoomClickEventData.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import WiredTriggerUserClickUserLogic from "../../../Rooms/Furniture/Logic/Wired/Trigger/WiredTriggerUserClickUserLogic.js";
import WiredTriggerUserClickFurniLogic from "../../../Rooms/Furniture/Logic/Wired/Trigger/WiredTriggerUserClickFurniLogic.js";
import WiredTriggerUserClickTileLogic from "../../../Rooms/Furniture/Logic/Wired/Trigger/WiredTriggerUserClickTileLogic.js";

export default class RoomClickEvent implements IncomingEvent<RoomClickEventData> {
    public readonly name = "RoomClickEvent";

    async handle(user: User, event: RoomClickEventData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(event.userId) {
            const targetUser = roomUser.room.getRoomUserById(event.userId);

            for(const logic of roomUser.room.getFurnitureWithCategory(WiredTriggerUserClickUserLogic)) {
                logic.handleUserClickUser(roomUser, targetUser);
            }
        }
        else if(event.furnitureId) {
            const roomFurniture = roomUser.room.getRoomFurniture(event.furnitureId);

            for(const logic of roomUser.room.getFurnitureWithCategory(WiredTriggerUserClickFurniLogic)) {
                logic.handleUserClicksFurniture(roomUser, roomFurniture);
            }
        }
        
        if(event.position) {
            for(const logic of roomUser.room.getFurnitureWithCategory(WiredTriggerUserClickTileLogic)) {
                logic.handleUserClicksTile(roomUser, event.position);
            }
        }
    }
}

