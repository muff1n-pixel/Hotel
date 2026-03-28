import { RoomBattleBanzaiGameTeam } from "../../../../../Games/BattleBanzai/Interfaces/RoomBattleBanzaiGameTeam";
import RoomBattleBanzaiGame from "../../../../../Games/BattleBanzai/RoomBattleBanzaiGame";
import RoomFurniture from "../../../../RoomFurniture";
import RoomFurnitureGameGateLogic from "../../RoomFurnitureGameGateLogic";

export default class RoomFurnitureBattleBanzaiGateLogic extends RoomFurnitureGameGateLogic<RoomBattleBanzaiGameTeam> {
    constructor(roomFurniture: RoomFurniture, team: RoomBattleBanzaiGameTeam) {
        super(roomFurniture, team, RoomBattleBanzaiGame);
    }
}
