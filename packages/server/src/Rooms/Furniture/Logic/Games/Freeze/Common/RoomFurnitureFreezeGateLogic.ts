import RoomFurniture from "../../../../RoomFurniture.js";
import RoomFurnitureGameGateLogic from "../../RoomFurnitureGameGateLogic.js";
import RoomGame from "../../../../../Games/RoomGame.js";
import { RoomFreezeGameTeam } from "../../../../../Games/Freeze/RoomFreezeGame.js";

export default class RoomFurnitureFreezeGateLogic extends RoomFurnitureGameGateLogic<RoomFreezeGameTeam> {
    constructor(roomFurniture: RoomFurniture, team: RoomFreezeGameTeam) {
        super(roomFurniture, team);
    }

    public getGame(): RoomGame<RoomFreezeGameTeam> {
        return this.roomFurniture.room.freezeGame;
    }
}
