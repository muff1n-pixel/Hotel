import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import RoomInstance from "@Client/Room/RoomInstance";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { clientInstance } from "../../../..";
import { ReactNode } from "react";
import RoomFurnitureTraxContextMenu from "@UserInterface/Components/Room/Item/ContextMenu/Furniture/Mannequin/RoomFurnitureTraxContextMenu";

export default class RoomFurnitureTraxLogic implements FurnitureLogic {
    constructor(private readonly room: RoomInstance, private readonly roomFurniture: RoomFurniture) {
    }

    isContextMenuAvailable(): boolean {
        return this.isAvailable();
    }

    getContextMenu(): ReactNode {
        return (<RoomFurnitureTraxContextMenu roomFurniture={this.roomFurniture}/>)
    }

    isAvailable() {
        return clientInstance.roomInstance.value?.hasRights === true;
    }

    use(): void {
        if(!this.isAvailable()) {
            return;
        }

    }
}
