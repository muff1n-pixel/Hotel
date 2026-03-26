import { RoomBattleBanzaiGameTeam } from "../../../../../Games/BattleBanzai/Interfaces/RoomBattleBanzaiGameTeam";
import RoomGame from "../../../../../Games/RoomGame";
import RoomFurniture from "../../../../RoomFurniture";
import RoomFurnitureGameGateLogic from "../../RoomFurnitureGameGateLogic";

export default class RoomFurnitureBattleBanzaiGateLogic extends RoomFurnitureGameGateLogic<RoomBattleBanzaiGameTeam> {
    constructor(roomFurniture: RoomFurniture, team: RoomBattleBanzaiGameTeam) {
        super(roomFurniture, team);
    }

    public getGame(): RoomGame<RoomBattleBanzaiGameTeam> {
        return this.roomFurniture.room.battleBanzaiGame;
    }
}
