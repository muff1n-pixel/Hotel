import RoomFurniture from "../../../../RoomFurniture.js";
import RoomFurnitureGameGateLogic from "../../RoomFurnitureGameGateLogic.js";
import RoomGame from "../../../../../Games/RoomGame.js";
import { RoomFreezeGameTeam } from "../../../../../Games/Freeze/RoomFreezeGame.js";
import RoomFurnitureGameTimerLogic from "../../RoomFurnitureGameTimerLogic.js";

export default class RoomFurnitureFreezeTimerLogic extends RoomFurnitureGameTimerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public getGame(): RoomGame {
        return this.roomFurniture.room.freezeGame;
    }
}
