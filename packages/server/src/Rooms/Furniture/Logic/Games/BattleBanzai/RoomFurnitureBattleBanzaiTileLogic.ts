import { RoomBattleBanzaiGameTeam } from "../../../../Games/BattleBanzai/Interfaces/RoomBattleBanzaiGameTeam";
import RoomUser from "../../../../Users/RoomUser";
import RoomFurniture from "../../../RoomFurniture";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic";

export default class RoomFurnitureBattleBanzaiTileLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {
    }

    async handleActionsInterval(): Promise<void> {

    }

    async handleUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        if(!this.roomFurniture.room.battleBanzaiGame.isPlaying()) {
            return;
        }

        const player = this.roomFurniture.room.battleBanzaiGame.players.getPlayer(roomUser);

        if(!player) {
            return;
        }

        for(let index = 0; index < ["red", "green", "blue", "yellow"].length; index++) {
            const teamAnimationId = ["red", "green", "blue", "yellow"].indexOf(player.team);
            const teamStartAnimationId = 3 + (teamAnimationId * 3);
            const teamFinishAnimationId = teamStartAnimationId + 2;

            if(this.roomFurniture.model.animation === teamFinishAnimationId) {
                return;
            }
        }

        const teamAnimationId = ["red", "green", "blue", "yellow"].indexOf(player.team);
        
        const teamStartAnimationId = 3 + (teamAnimationId * 3);
        const teamFinishAnimationId = teamStartAnimationId + 2;

        if(this.roomFurniture.model.animation === teamFinishAnimationId) {
            return;
        }

        if(this.roomFurniture.model.animation >= teamStartAnimationId && this.roomFurniture.model.animation < teamFinishAnimationId) {
            await this.roomFurniture.setAnimation(this.roomFurniture.model.animation + 1);

            if(this.roomFurniture.model.animation === teamFinishAnimationId) {
                this.roomFurniture.room.battleBanzaiGame.teams.addTeamScore(player.team, 1);
            }

            return;
        }

        await this.roomFurniture.setAnimation(teamStartAnimationId);
    }
}
