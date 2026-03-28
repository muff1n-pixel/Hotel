import { RoomPositionData } from "@pixel63/events";
import RoomUser from "../../../../Users/RoomUser";
import RoomFurniture from "../../../RoomFurniture";
import RoomFurnitureFootballLogic from "../RoomFurnitureFootballLogic";
import RoomFurnitureBattleBanzaiTileLogic from "./RoomFurnitureBattleBanzaiTileLogic";
import RoomBattleBanzaiGame from "../../../../Games/BattleBanzai/RoomBattleBanzaiGame";

export default class RoomFurnitureBattleBanzaiPuckLogic extends RoomFurnitureFootballLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleFootballMoved(user: RoomUser | null, position: RoomPositionData): Promise<void> {
        if(!this.roomFurniture.room.games.isGamePlaying(RoomBattleBanzaiGame)) {
            return;
        }

        if(!user) {
            return;
        }

        const game = this.roomFurniture.room.games.getGame(RoomBattleBanzaiGame);

        const player = game?.players.getPlayer(user);

        if(!player) {
            return;
        }

        const animation = 1 + (["red", "green", "blue", "yellow"].indexOf(player.team));

        if(this.roomFurniture.model.animation !== animation) {
            await this.roomFurniture.setAnimation(animation);
        }

        const tilesAtPosition = this.roomFurniture.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureBattleBanzaiTileLogic && furniture.model.position.row === position.row && furniture.model.position.column === position.column);

        for(const furniture of tilesAtPosition) {
            if(!(furniture.logic instanceof RoomFurnitureBattleBanzaiTileLogic)) {
                continue;
            }

            furniture.logic.handleUserWalksOn(user, []).catch(console.error);
        }
    }

    public async handleFootballStopped(): Promise<void> {
        if(this.roomFurniture.model.animation !== 0) {
            this.roomFurniture.setAnimation(0).catch(console.error);;
        }
    }
}
