import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import RoomInstance from "@Client/Room/RoomInstance";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { clientInstance } from "../../../..";
import { ReactNode } from "react";
import RoomFurnitureMannequinContextMenu from "@UserInterface/Components/Room/Item/ContextMenu/Furniture/Mannequin/RoomFurnitureMannequinContextMenu";

export default class RoomFurnitureMannequinLogic implements FurnitureLogic {
    constructor(private readonly room: RoomInstance, private readonly roomFurniture: RoomFurniture) {
    }

    isContextMenuAvailable(): boolean {
        return true;
    }

    getContextMenu(): ReactNode {
        return (<RoomFurnitureMannequinContextMenu roomFurniture={this.roomFurniture}/>)
    }

    isAvailable() {
        return this.roomFurniture.data.data?.mannequin?.figureConfiguration !== undefined;
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
