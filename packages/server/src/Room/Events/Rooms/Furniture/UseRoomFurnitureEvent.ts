import { UseRoomFurnitureData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener";
import RoomWebSocketUser from "../../../Server/Users/RoomWebSocketUser";

export default class UseRoomFurnitureEvent implements RoomProtobuffListener<UseRoomFurnitureData> {
    minimumDurationBetweenEvents?: number = 100;
    
    async handle(user: RoomWebSocketUser, payload: UseRoomFurnitureData) {
        const roomFurniture = user.roomUser.room.getRoomFurniture(payload.id);

        await roomFurniture.logic?.use?.(user.roomUser, payload);
    }
}
