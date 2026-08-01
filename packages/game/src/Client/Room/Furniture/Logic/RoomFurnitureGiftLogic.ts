import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import RoomInstance from "@Client/Room/RoomInstance";
import { clientInstance, webSocketClient } from "../../../..";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";

export default class RoomFurnitureGiftLogic implements FurnitureLogic {
    constructor(private readonly room: RoomInstance, private readonly roomFurniture: RoomFurniture) {
    }

    isAvailable() {
        return this.roomFurniture.data.data?.gift !== undefined;
    }

    use(): void {
        if(!this.isAvailable()) {
            return;
        }

        this.removeExistingDialog();

        clientInstance.dialogs.value = clientInstance.dialogs.value?.concat({
            id: Math.random().toString(),
            type: "room-furniture-logic",
            data: this.roomFurniture
        });
    }

    private removeExistingDialog() {
        if(!clientInstance.dialogs.value) {
            return;
        }

        const existingIndex = clientInstance.dialogs.value.findIndex((dialog) => dialog.type === "room-furniture-logic" && (dialog.data as any)?.furniture?.data?.id === this.roomFurniture.data.id);

        if(existingIndex === -1) {
            return;
        }

        clientInstance.dialogs.value.splice(existingIndex, 1);
    }
}
