import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomFurnitureMovedData } from "@pixel63/events";

export default class RoomFurnitureMovedEvent implements ProtobuffListener<RoomFurnitureMovedData> {
    async handle(payload: RoomFurnitureMovedData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        if(!payload.position) {
            return;
        }

        const roomFurnitureItem = clientInstance.roomInstance.value.getFurnitureById(payload.id);

        roomFurnitureItem.item.setPositionPath(roomFurnitureItem.item.position!, payload.position);
        roomFurnitureItem.data.position = payload.position;
    }
}
