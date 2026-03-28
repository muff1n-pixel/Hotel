import RoomFurniture from "../../../../RoomFurniture.js";
import RoomFurnitureGameGateLogic from "../../RoomFurnitureGameGateLogic.js";
import RoomFreezeGame, { RoomFreezeGameTeam } from "../../../../../Games/Freeze/RoomFreezeGame.js";

export default class RoomFurnitureFreezeGateLogic extends RoomFurnitureGameGateLogic<RoomFreezeGameTeam> {
    constructor(roomFurniture: RoomFurniture, team: RoomFreezeGameTeam) {
        super(roomFurniture, team, RoomFreezeGame);
    }
}
