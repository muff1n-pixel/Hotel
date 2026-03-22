import { RoomPositionOffsetData } from "@pixel63/events";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic";
import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";
import { RoomFreezeGamePlayer } from "../../../../Games/Freeze/RoomFreezeGame";
import RoomFurnitureFreezeBlockLogic from "./RoomFurnitureFreezeBlockLogic";

export default class RoomFurnitureFreezeTileLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {
        this.roomFurniture.setAnimation(0);
    }

    async use(roomUser: RoomUser): Promise<void> {
        const player = this.roomFurniture.room.freezeGame.getPlayer(roomUser);

        if(!player) {
            return;
        }

        if(!this.roomFurniture.room.freezeGame.started || this.roomFurniture.room.freezeGame.paused) {
            return;
        }

        if(this.roomFurniture.model.animation !== 0) {
            return;
        }

        if(roomUser.path.frozen) {
            return;
        }

        if(this.roomFurniture.model.position.row !== roomUser.position.row || this.roomFurniture.model.position.column !== roomUser.position.column) {
            await new Promise<void>((resolve, reject) => {
                roomUser.path.walkTo(RoomPositionOffsetData.fromJSON(this.roomFurniture.model.position), undefined, resolve, reject);
            });
        }

        await this.roomFurniture.room.handleUserUseFurniture(roomUser, this.roomFurniture);

        await this.roomFurniture.setAnimation(1);

        await new Promise((resolve) => setTimeout(resolve, 2500));

        if(!this.roomFurniture.room.freezeGame.started || this.roomFurniture.room.freezeGame.paused) {
            await this.roomFurniture.setAnimation(0);

            return;
        }

        await this.handleSnowball(player);

        for(let direction = 0; direction <= 6; direction += 2) {
            for(let offset = 1; offset <= 2; offset++) {
                const offsetPosition = this.roomFurniture.getOffsetPosition(offset, direction);

                const upmostFurniture = this.roomFurniture.room.getUpmostFurnitureAtPosition(offsetPosition);

                if(!upmostFurniture) {
                    break;
                }

                if(upmostFurniture.logic instanceof RoomFurnitureFreezeTileLogic) {
                    if(await upmostFurniture.logic.handleSnowball(player)) {
                        break;
                    }

                    continue;
                }
                else if(upmostFurniture.logic instanceof RoomFurnitureFreezeBlockLogic) {
                    upmostFurniture.logic.handleSnowball();

                    break;
                }

                break;
            }
        }
    }

    private lastSnowballed: number = 0;

    public async handleSnowball(player: RoomFreezeGamePlayer) {
        this.lastSnowballed = performance.now();

        await this.roomFurniture.setAnimation(101);

        const hitPlayer = this.roomFurniture.room.freezeGame.getPlayerAtPosition(this.roomFurniture.model.position);

        if(hitPlayer) {
            this.roomFurniture.room.freezeGame.freezePlayer(hitPlayer, player);

            return true;
        }

        return false;
    }

    async handleActionsInterval(): Promise<void> {
        if(this.roomFurniture.model.animation === 101 && performance.now() - this.lastSnowballed >= 500) {
            await this.roomFurniture.setAnimation(0);
        }
    }
}