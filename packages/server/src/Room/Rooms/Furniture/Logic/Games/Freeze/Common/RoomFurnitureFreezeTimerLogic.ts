import RoomFurniture from "../../../../RoomFurniture.js";
import RoomFreezeGame from "../../../../../Games/Freeze/RoomFreezeGame.js";
import RoomFurnitureGameTimerLogic from "../../RoomFurnitureGameTimerLogic.js";

export default class RoomFurnitureFreezeTimerLogic extends RoomFurnitureGameTimerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture, RoomFreezeGame);
    }
}
