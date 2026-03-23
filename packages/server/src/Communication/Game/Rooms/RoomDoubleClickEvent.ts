import User from "../../../Users/User.js";
import WiredTriggerUserClickUserLogic from "../../../Rooms/Furniture/Logic/Wired/Trigger/WiredTriggerUserClickUserLogic.js";
import WiredTriggerUserClickFurniLogic from "../../../Rooms/Furniture/Logic/Wired/Trigger/WiredTriggerUserClickFurniLogic.js";
import WiredTriggerUserClickTileLogic from "../../../Rooms/Furniture/Logic/Wired/Trigger/WiredTriggerUserClickTileLogic.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { RoomClickData, RoomDoubleClickData, RoomPositionOffsetData } from "@pixel63/events";

export default class RoomDoubleClickEvent implements ProtobuffListener<RoomDoubleClickData> {
    async handle(user: User, payload: RoomDoubleClickData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(payload.position) {
            const furnitureAtPosition = user.room.getAllFurnitureAtPosition(RoomPositionOffsetData.fromJSON(payload.position));

            for(const furniture of furnitureAtPosition) {
                furniture.logic?.handleUserDoubleClickOnTile?.(roomUser, payload.position);
            }
        }
    }
}
