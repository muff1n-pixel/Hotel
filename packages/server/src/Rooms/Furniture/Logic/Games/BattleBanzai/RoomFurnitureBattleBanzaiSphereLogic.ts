import RoomBattleBanzaiGame from "../../../../Games/BattleBanzai/RoomBattleBanzaiGame";
import RoomFurniture from "../../../RoomFurniture";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic";

export default class RoomFurnitureBattleBanzaiSphereLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async handleActionsInterval(): Promise<void> {
        const game = this.roomFurniture.room.games.getGame(RoomBattleBanzaiGame);

        if(!game) {
            return;
        }

        if(game.ending) {
            const winningTeam = game.teams.getTeamWithMostScore();

            if(winningTeam) {
                const leadingTeamAnimation = 102 + (["red", "green", "blue", "yellow"].indexOf(winningTeam.team));

                if(this.roomFurniture.model.animation !== leadingTeamAnimation) {
                    await this.roomFurniture.setAnimation(leadingTeamAnimation);
                }
            }

            return;
        }

        if(!game.started) {
            if(this.roomFurniture.model.animation !== 0) {
                await this.roomFurniture.setAnimation(0);
            }

            return;
        }

        if(game.starting) {
            if(this.roomFurniture.model.animation !== 101) {
                await this.roomFurniture.setAnimation(101);
            }

            return;
        }

        if(game.paused) {
            if(this.roomFurniture.model.animation !== 3) {
                await this.roomFurniture.setAnimation(3);
            }

            return;
        }

        const leadingTeam = game.teams.getTeamWithMostScore();

        if(!leadingTeam) {
            if(this.roomFurniture.model.animation !== 1) {
                await this.roomFurniture.setAnimation(1);
            }

            return;
        }

        const leadingTeamAnimation = 10 + (["red", "green", "blue", "yellow"].indexOf(leadingTeam.team));

        if(this.roomFurniture.model.animation !== leadingTeamAnimation) {
            await this.roomFurniture.setAnimation(leadingTeamAnimation);
        }
    }
}
