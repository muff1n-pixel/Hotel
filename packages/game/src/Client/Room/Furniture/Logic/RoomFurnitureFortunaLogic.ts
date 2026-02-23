import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import RoomInstance from "@Client/Room/RoomInstance";
import { UseRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData";
import { webSocketClient } from "../../../..";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";

export default class RoomFurnitureFortunaLogic implements FurnitureLogic {
    constructor(private readonly room: RoomInstance, private readonly roomFurniture: RoomFurniture) {
    }

    isAvailable() {
        return this.room.hasRights;
    }

    use(): void {
        if(!this.isAvailable()) {
            return;
        }

        webSocketClient.send<UseRoomFurnitureEventData>("UseRoomFurnitureEvent", {
            roomFurnitureId: this.roomFurniture.data.id
        });
    }
}
