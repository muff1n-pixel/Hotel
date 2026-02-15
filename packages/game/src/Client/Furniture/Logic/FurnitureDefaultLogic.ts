import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import RoomInstance from "@Client/Room/RoomInstance";

export default class FurnitureDefaultLogic implements FurnitureLogic {
    constructor(private readonly room: RoomInstance, private readonly roomFurniture: RoomFurniture) {
    }

    isAvailable() {
        return false;
    }

    use(): void {
        
    }
}
