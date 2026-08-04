import RoomFurniture from "../../../../RoomFurniture.js";
import RoomFurnitureGameTimerLogic from "../../RoomFurnitureGameTimerLogic.js";
import RoomBattleBanzaiGame from "../../../../../Games/BattleBanzai/RoomBattleBanzaiGame.js";

export default class RoomFurnitureBattleBanzaiTimerLogic extends RoomFurnitureGameTimerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture, RoomBattleBanzaiGame);
    }
}
