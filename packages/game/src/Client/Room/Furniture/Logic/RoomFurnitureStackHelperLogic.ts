import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import RoomInstance from "@Client/Room/RoomInstance";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { clientInstance } from "../../../..";

export default class RoomFurnitureStackHelperLogic implements FurnitureLogic {
    constructor(private readonly room: RoomInstance, private readonly roomFurniture: RoomFurniture) {
    }

    isAvailable() {
        return this.room.hasRights;
    }

    use(): void {
        if(!this.isAvailable()) {
            return;
        }

        clientInstance.dialogs.value = clientInstance.dialogs.value?.filter((dialog) => !(dialog.type === "room-furniture-logic" && dialog.id === this.roomFurniture.data.id)).concat({
            id: this.roomFurniture.data.id,
            type: "room-furniture-logic",
            data: this.roomFurniture
        });
    }
}
