import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import RoomInstance from "@Client/Room/RoomInstance";
import { webSocketClient } from "../../../..";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { UseRoomFurnitureData } from "@pixel63/events";

export default class RoomFurnitureTeleportLogic implements FurnitureLogic {
    constructor(private readonly room: RoomInstance, private readonly roomFurniture: RoomFurniture) {
    }

    isAvailable() {
        return true;
    }

    use(): void {
        if(!this.isAvailable()) {
            return;
        }
                
        webSocketClient.sendProtobuff(UseRoomFurnitureData, UseRoomFurnitureData.create({
            id: this.roomFurniture.data.id
        }));
    }
}
