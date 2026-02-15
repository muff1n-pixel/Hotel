import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import RoomInstance from "@Client/Room/RoomInstance";
import { clientInstance } from "../../..";
import { RoomFurnitureDimmerData } from "../../../UserInterface/components/Room/Furniture/Logic/Dimmer/RoomFurnitureDimmerDialog";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";

export default class FurnitureRoomDimmerLogic implements FurnitureLogic {
    constructor(private readonly room: RoomInstance, private readonly roomFurniture: RoomFurniture) {
    }

    isAvailable() {
        if(!this.room.hasRights) {
            return false;
        }
        
        return true;
    }

    use(): void {
        this.removeExistingDialog();

        clientInstance.dialogs.value = clientInstance.dialogs.value?.concat([
            {
                id: Math.random().toString(),
                type: "room-furniture-logic",
                data: {
                    furniture: this.roomFurniture,
                    type: "furniture_roomdimmer"
                } satisfies RoomFurnitureDimmerData
            }
        ]);
    }

    private removeExistingDialog() {
        if(!clientInstance.dialogs.value) {
            return;
        }

        const existingIndex = clientInstance.dialogs.value.findIndex((dialog) => dialog.type === "room-furniture-logic");

        if(existingIndex === -1) {
            return;
        }

        clientInstance.dialogs.value.splice(existingIndex, 1);
    }
}
