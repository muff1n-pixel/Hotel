import RoomInstance from "../RoomInstance";
import { RoomFurnitureModel } from "../../Database/Models/Rooms/RoomFurnitureModel.js";
import { RoomFurnitureData } from "@shared/Interfaces/Room/RoomFurnitureData.js";

export default class RoomFurnitureItem {
    constructor(private readonly roomInstance: RoomInstance, public readonly roomFurniture: RoomFurnitureModel) {
    }

    public getFurnitureData(): RoomFurnitureData {
        return {
            id: this.roomFurniture.id,
            furniture: this.roomFurniture.furniture,
            position: this.roomFurniture.position,
            direction: this.roomFurniture.direction,
            animation: this.roomFurniture.animation
        };
    }
}
