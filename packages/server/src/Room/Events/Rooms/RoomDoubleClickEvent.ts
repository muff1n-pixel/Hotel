import { RoomDoubleClickData, RoomPositionOffsetData } from "@pixel63/events";
import { RoomProtobuffListener } from "../Interfaces/RoomProtobuffListener.js";
import RoomWebSocketUser from "../../Server/Users/RoomWebSocketUser.js";

export default class RoomDoubleClickEvent implements RoomProtobuffListener<RoomDoubleClickData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: RoomWebSocketUser, payload: RoomDoubleClickData) {
        if(payload.position) {
            const furnitureAtPosition = user.roomUser.room.getAllFurnitureAtPosition(RoomPositionOffsetData.fromJSON(payload.position));

            for(const furniture of furnitureAtPosition) {
                furniture.logic?.handleUserDoubleClickOnTile?.(user.roomUser, payload.position).catch(console.error);
            }
        }
    }
}
