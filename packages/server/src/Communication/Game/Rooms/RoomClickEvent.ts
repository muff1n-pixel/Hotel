import User from "../../../Users/User.js";
import WiredTriggerUserClickUserLogic from "../../../Rooms/Furniture/Logic/Wired/Trigger/WiredTriggerUserClickUserLogic.js";
import WiredTriggerUserClickFurniLogic from "../../../Rooms/Furniture/Logic/Wired/Trigger/WiredTriggerUserClickFurniLogic.js";
import WiredTriggerUserClickTileLogic from "../../../Rooms/Furniture/Logic/Wired/Trigger/WiredTriggerUserClickTileLogic.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { RoomClickData } from "@pixel63/events";

export default class RoomClickEvent implements ProtobuffListener<RoomClickData> {
    public readonly name = "RoomClickEvent";

    async handle(user: User, payload: RoomClickData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(payload.userId) {
            const targetUser = roomUser.room.getRoomUserById(payload.userId);

            for(const logic of roomUser.room.getFurnitureWithCategory(WiredTriggerUserClickUserLogic)) {
                logic.handleUserClickUser(roomUser, targetUser);
            }
        }
        else if(payload.furnitureId) {
            const roomFurniture = roomUser.room.getRoomFurniture(payload.furnitureId);

            for(const logic of roomUser.room.getFurnitureWithCategory(WiredTriggerUserClickFurniLogic)) {
                logic.handleUserClicksFurniture(roomUser, roomFurniture);
            }
        }
        
        if(payload.position) {
            for(const logic of roomUser.room.getFurnitureWithCategory(WiredTriggerUserClickTileLogic)) {
                logic.handleUserClicksTile(roomUser, payload.position);
            }
        }
    }
}

