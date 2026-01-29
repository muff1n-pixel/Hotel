import Furniture from "@Client/Furniture/Furniture";
import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";

export default class FurnitureDefaultLogic implements FurnitureLogic {
    constructor(private readonly furniture: Furniture) {

    }

    isAvailable() {
        return false;
    }

    use(roomFurniture: RoomInstanceFurniture): void {
        
    }
}
