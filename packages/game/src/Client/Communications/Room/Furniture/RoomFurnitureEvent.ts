import { clientInstance } from "../../../..";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomFurnitureData } from "@pixel63/events";

export default class RoomFurnitureEvent implements ProtobuffListener<RoomFurnitureData> {
    async handle(payload: RoomFurnitureData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        if(payload.furnitureUpdated?.length) {
            for(const furniture of payload.furnitureUpdated) {
                const roomFurnitureItem = clientInstance.roomInstance.value.getFurnitureById(furniture.id);

                roomFurnitureItem.updateData(furniture);
            }
        }

        if(payload.furnitureAdded?.length) {
            clientInstance.roomInstance.value.furnitures.push(...payload.furnitureAdded.map((roomFurnitureData) => {
                const furnitureData = payload.furnitureData.find((furnitureData) => furnitureData.id === roomFurnitureData.furnitureId);

                if(!furnitureData) {
                    throw new Error("Server did not send furniture data for user furniture.");
                }

                return new RoomFurniture(clientInstance.roomInstance.value!, furnitureData, roomFurnitureData);
            }));
        }

        if(payload.furnitureRemoved?.length) {
            payload.furnitureRemoved.map((roomFurnitureData) => clientInstance.roomInstance.value!.removeFurniture(roomFurnitureData.id));
        }

        clientInstance.roomInstance.update();
    }
}
