import RoomFurniture from "../../../RoomFurniture";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic";

export default class RoomFurnitureBattleBanzaiSphereLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async handleActionsInterval(): Promise<void> {
        if(!this.roomFurniture.room.battleBanzaiGame.started) {
            if(this.roomFurniture.model.animation !== 0) {
                await this.roomFurniture.setAnimation(0);
            }

            return;
        }

        if(this.roomFurniture.room.battleBanzaiGame.starting) {
            if(this.roomFurniture.model.animation !== 101) {
                await this.roomFurniture.setAnimation(101);
            }

            return;
        }

        if(this.roomFurniture.room.battleBanzaiGame.paused) {
            if(this.roomFurniture.model.animation !== 3) {
                await this.roomFurniture.setAnimation(3);
            }

            return;
        }

        const leadingTeam = this.roomFurniture.room.battleBanzaiGame.teams.getTeamWithMostScore();

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
