import { RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic";
import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";
import { RoomFreezeGamePlayer } from "../../../../Games/Freeze/RoomFreezeGame";
import RoomFurnitureFreezeBlockLogic from "./RoomFurnitureFreezeBlockLogic";

export default class RoomFurnitureFreezeTileLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {
        this.roomFurniture.setAnimation(0);
    }

    async handleUserDoubleClickOnTile(roomUser: RoomUser, tile: RoomPositionData): Promise<void> {
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

        if(player.currentSnowballs >= player.maxSnowballs) {
            return;
        }

        player.currentSnowballs++;

        await this.roomFurniture.room.handleUserUseFurniture(roomUser, this.roomFurniture);

        if(player.megaSnowball) {
            await this.roomFurniture.setAnimation(6);
        }
        else {
            await this.roomFurniture.setAnimation(Math.max(1, Math.min(4, player.radius - 3)));
        }

        await new Promise((resolve) => setTimeout(resolve, 2500));

        player.currentSnowballs--;

        if(!this.roomFurniture.room.freezeGame.started || this.roomFurniture.room.freezeGame.paused) {
            await this.roomFurniture.setAnimation(0);

            return;
        }

        await this.handleSnowball(player);

        if(player.megaSnowball) {
            player.megaSnowball = false;

            for(let direction = 0; direction < 8; direction++) {
                const radius = ((direction % 2) === 0)?(player.radius + 2):(0);

                for(let offset = 0; offset < radius + 1; offset++) {
                    const offsetPosition = this.roomFurniture.getOffsetPosition(offset + 1, direction);

                    const allFurnitureOnPosition = this.roomFurniture.room.getAllFurnitureAtPosition(offsetPosition);
                    
                    if(!allFurnitureOnPosition) {
                        break;
                    }

                    let shouldBreak = false;

                    for(const furniture of allFurnitureOnPosition) {
                        if(furniture.logic instanceof RoomFurnitureFreezeTileLogic) {
                            if(await furniture.logic.handleSnowball(player)) {
                                shouldBreak = true;

                                break;
                            }

                            continue;
                        }
                        else if(furniture.logic instanceof RoomFurnitureFreezeBlockLogic && furniture.model.animation === 0) {
                            furniture.logic.handleSnowball();

                            shouldBreak = true;

                            break;
                        }
                    }

                    if(shouldBreak) {
                        break;
                    }
                }
            }
        }
        else {
            const targetDirection = (player.crossBlast)?(1):(0);
            player.crossBlast = false;

            for(let direction = targetDirection; direction < 8; direction += 2) {
                for(let offset = 0; offset < player.radius; offset++) {
                    const offsetPosition = this.roomFurniture.getOffsetPosition(offset + 1, direction);

                    const allFurnitureOnPosition = this.roomFurniture.room.getAllFurnitureAtPosition(offsetPosition);

                    if(!allFurnitureOnPosition) {
                        break;
                    }

                    let shouldBreak = false;

                    for(const furniture of allFurnitureOnPosition) {
                        if(furniture.logic instanceof RoomFurnitureFreezeTileLogic) {
                            if(await furniture.logic.handleSnowball(player)) {
                                shouldBreak = true;

                                break;
                            }

                            continue;
                        }
                        else if(furniture.logic instanceof RoomFurnitureFreezeBlockLogic && furniture.model.animation === 0) {
                            furniture.logic.handleSnowball();

                            shouldBreak = true;

                            break;
                        }
                    }

                    if(shouldBreak) {
                        break;
                    }
                }
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