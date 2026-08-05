import WiredTriggerUserClickUserLogic from "../../Rooms/Furniture/Logic/Wired/Trigger/WiredTriggerUserClickUserLogic.js";
import WiredTriggerUserClickFurniLogic from "../../Rooms/Furniture/Logic/Wired/Trigger/WiredTriggerUserClickFurniLogic.js";
import WiredTriggerUserClickTileLogic from "../../Rooms/Furniture/Logic/Wired/Trigger/WiredTriggerUserClickTileLogic.js";
import { RoomClickData } from "@pixel63/events";
import { RoomProtobuffListener } from "../Interfaces/RoomProtobuffListener.js";
import RoomWebSocketUser from "../../Server/Users/RoomWebSocketUser.js";

export default class RoomClickEvent implements RoomProtobuffListener<RoomClickData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: RoomWebSocketUser, payload: RoomClickData) {
        if(payload.userId) {
            const targetUser = user.roomUser.room.getRoomUserById(payload.userId);

            for(const logic of user.roomUser.room.getFurnitureWithCategory(WiredTriggerUserClickUserLogic)) {
                logic.handleUserClickUser(user.roomUser, targetUser).catch(console.error);
            }
        }
        else if(payload.furnitureId) {
            const roomFurniture = user.roomUser.room.getRoomFurniture(payload.furnitureId);

            for(const logic of user.roomUser.room.getFurnitureWithCategory(WiredTriggerUserClickFurniLogic)) {
                logic.handleUserClicksFurniture(user.roomUser, roomFurniture).catch(console.error);
            }
        }
        
        if(payload.position) {
            for(const logic of user.roomUser.room.getFurnitureWithCategory(WiredTriggerUserClickTileLogic)) {
                logic.handleUserClicksTile(user.roomUser, payload.position).catch(console.error);
            }
        }
    }
}

