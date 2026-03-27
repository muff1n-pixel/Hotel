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
            for(const furnitureUpdate of payload.furnitureUpdated) {
                try {
                    if(!furnitureUpdate.furniture) {
                        continue;
                    }

                    const roomFurnitureItem = clientInstance.roomInstance.value.getFurnitureById(furnitureUpdate.furniture.id);

                    if(furnitureUpdate.userId === clientInstance.user.value?.id) {
                        if(furnitureUpdate.furniture.direction !== roomFurnitureItem.furniture.direction) {
                            roomFurnitureItem.item.setPositionPath(roomFurnitureItem.item.position!, [
                                {
                                    ...roomFurnitureItem.item.position!,
                                    depth: roomFurnitureItem.item.position!.depth + 0.25
                                },
                                {
                                    ...roomFurnitureItem.item.position!,
                                }
                            ],
                            100);
                        }
                    }

                    roomFurnitureItem.updateData(furnitureUpdate.furniture);
                }
                catch(error) {
                    console.error(error);
                }
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
            payload.furnitureRemoved.map((roomFurnitureData) => clientInstance.roomInstance.value!.removeFurniture(roomFurnitureData.id, payload.hideFlyingFurniture));
        }

        clientInstance.roomInstance.update();
    }
}
