import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import RoomInstance from "@Client/Room/RoomInstance";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { clientInstance } from "../../../../..";
import { RoomFurnitureLogicDialogData } from "../../../../../UserInterface/components/Room/Furniture/Logic/RoomFurnitureLogicDialog";

export default class RoomFurnitureWiredLogic implements FurnitureLogic {
    constructor(private readonly room: RoomInstance, private readonly roomFurniture: RoomFurniture) {
    }

    isAvailable() {
        return this.room.hasRights;
    }

    use(): void {
        if(!this.isAvailable()) {
            return;
        }

        this.removeExistingDialog();

        clientInstance.dialogs.value = clientInstance.dialogs.value?.concat({
            id: Math.random().toString(),
            type: "room-furniture-logic",
            data: {
                furniture: this.roomFurniture,
                type: this.roomFurniture.data.furniture.interactionType as any
            } satisfies RoomFurnitureLogicDialogData
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
