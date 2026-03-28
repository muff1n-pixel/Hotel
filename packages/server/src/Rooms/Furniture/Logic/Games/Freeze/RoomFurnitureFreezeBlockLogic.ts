import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic";
import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";
import RoomFreezeGame from "../../../../Games/Freeze/RoomFreezeGame";

export default class RoomFurnitureFreezeBlockLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {
        this.roomFurniture.setAnimation(0).catch(console.error);
    }

    public isWalkable(): boolean {
        return this.roomFurniture.model.animation !== 0;
    }

    public async handleSnowball(blockedByActor: boolean = false) {
        await this.roomFurniture.setAnimation(101);

        setTimeout(() => {
            if(blockedByActor) {
                this.roomFurniture.setAnimation(1).catch(console.error);
            }
            else {
                this.roomFurniture.setAnimation(1 + Math.floor(Math.random() * 7)).catch(console.error);
            }
        }, 500);
    }

    public async handleBeforeUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        if(!this.roomFurniture.room.games.isGamePlaying(RoomFreezeGame)) {
            return;
        }

        const game = this.roomFurniture.room.games.getGame(RoomFreezeGame);
       
        if(!game) {
            return;
        }

        const player = game.players.getPlayer(roomUser);

        if(!player) {
            return;
        }

        if(this.roomFurniture.model.animation > 1 && this.roomFurniture.model.animation < 8) {
            game.givePlayerPowerup(player, this.roomFurniture.model.animation);

            this.roomFurniture.setAnimation(110 + this.roomFurniture.model.animation).then(() => {
                setTimeout(() => {
                    this.roomFurniture.setAnimation(1).catch(console.error);
                }, 500);
            }).catch(console.error);

        }
    }

    async handleActionsInterval(): Promise<void> {

    }
}
