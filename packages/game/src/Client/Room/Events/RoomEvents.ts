import ClientInstance from "@Client/ClientInstance";
import RoomInstance from "../RoomInstance";
import { webSocketClient } from "../../..";
import { RoomLoadData, RoomReadyData } from "@pixel63/events";
import { RoomLogger } from "@pixel63/shared/Logger/Logger";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";

export default function registerRoomEvents(clientInstance: ClientInstance) {
    webSocketClient.addProtobuffListener(RoomLoadData, {
        async handle(payload: RoomLoadData) {
            if(clientInstance.roomInstance.value) {
                clientInstance.roomInstance.value.terminate();

                clientInstance.roomInstance.value = undefined;
                //throw new Error("TODO: room is already loaded!!");
            }

            clientInstance.roomInstance.value = new RoomInstance(clientInstance, payload);

            for(const furniture of payload.furniture) {
                const furnitureData = payload.furnitureData.find((furnitureData) => furnitureData.id === furniture.furnitureId);

                if(!furnitureData) {
                    RoomLogger.error("Server did not send furniture data for user furniture!", {
                        furniture
                    });

                    continue;
                }

                clientInstance.roomInstance.value.furnitures.push(new RoomFurniture(clientInstance.roomInstance.value, furnitureData, furniture));
            }

            webSocketClient.sendProtobuff(RoomReadyData, RoomReadyData.create({}));
        },
    })
}
