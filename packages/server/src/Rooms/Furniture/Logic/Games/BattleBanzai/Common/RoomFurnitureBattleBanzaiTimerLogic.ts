import RoomFurniture from "../../../../RoomFurniture.js";
import RoomGame from "../../../../../Games/RoomGame.js";
import RoomFurnitureGameTimerLogic from "../../RoomFurnitureGameTimerLogic.js";

export default class RoomFurnitureBattleBanzaiTimerLogic extends RoomFurnitureGameTimerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public getGame(): RoomGame {
        return this.roomFurniture.room.battleBanzaiGame;
    }
}
