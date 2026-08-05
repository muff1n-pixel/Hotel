import RoomFootballGame from "../../../../Games/Football/RoomFootballGame.js";
import RoomFurniture from "../../../RoomFurniture.js";
import RoomFurnitureGameTimerLogic from "../RoomFurnitureGameTimerLogic.js";

export default class RoomFurnitureFootballTimerLogic extends RoomFurnitureGameTimerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture, RoomFootballGame);
    }
}
