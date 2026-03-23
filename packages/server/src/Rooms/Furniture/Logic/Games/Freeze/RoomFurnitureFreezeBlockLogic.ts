import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic";
import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";

export default class RoomFurnitureFreezeBlockLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {
        this.roomFurniture.setAnimation(0);
    }

    public isWalkable(): boolean {
        return this.roomFurniture.model.animation !== 0;
    }

    public async handleSnowball() {
        await this.roomFurniture.setAnimation(101);

        setTimeout(async () => {
            await this.roomFurniture.setAnimation(1 + Math.floor(Math.random() * 7));
        }, 500);
    }

    public async handleUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        if(!this.roomFurniture.room.freezeGame.started || this.roomFurniture.room.freezeGame.paused) {
            return;
        }
        
        const player = this.roomFurniture.room.freezeGame.getPlayer(roomUser);

        if(!player) {
            return;
        }

        if(this.roomFurniture.model.animation > 1 && this.roomFurniture.model.animation < 8) {
            this.roomFurniture.room.freezeGame.givePlayerPowerup(player, this.roomFurniture.model.animation);

            await this.roomFurniture.setAnimation(110 + this.roomFurniture.model.animation);

            setTimeout(async () => {
                await this.roomFurniture.setAnimation(1);
            }, 500);
        }
    }

    async handleActionsInterval(): Promise<void> {

    }
}
