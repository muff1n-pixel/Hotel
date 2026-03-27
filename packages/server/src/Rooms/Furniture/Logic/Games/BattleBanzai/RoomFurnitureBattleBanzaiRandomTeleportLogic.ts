import { RoomFurnitureMovedData, RoomPositionData, RoomPositionOffsetData, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../../Users/RoomUser";
import RoomFurniture from "../../../RoomFurniture";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic";

type BattleBanzaiRandomTeleportAction = {
    roomUser: RoomUser;
    targetFurniture: RoomFurniture;

    interval: number;
};

export default class RoomFurnitureBattleBanzaiRandomTeleportLogic implements RoomFurnitureLogic {
    private activeActions: BattleBanzaiRandomTeleportAction[] = [];

    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async handleUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        if (this.roomFurniture.model.animation !== 0) {
            return;
        }

        const randomTeleport = this.getRandomTeleport();

        if (!randomTeleport) {
            return;
        }

        await this.roomFurniture.setAnimation(1);

        this.activeActions.push({
            roomUser,
            targetFurniture: randomTeleport,
            interval: 0
        });
    }

    async handleActionsInterval(): Promise<void> {
        for (const action of this.activeActions) {
            switch (action.interval) {
                case 0: {
                    await action.targetFurniture.setAnimation(1);

                    action.roomUser.path.teleportTo(
                        RoomPositionOffsetData.fromJSON(action.targetFurniture.model.position),
                        false
                    );

                    break;
                }

                case 1: {
                    if (this.roomFurniture.model.animation === 1) {
                        await this.roomFurniture.setAnimation(0);
                    }

                    break;
                }

                case 2: {
                    if (action.targetFurniture.model.animation === 1) {
                        await action.targetFurniture.setAnimation(0);
                    }

                    break;
                }
            }

            action.interval++;
        }

        this.activeActions = this.activeActions.filter(a => a.interval < 3);
    }

    private getRandomTeleport() {
        const teleports = this.roomFurniture.room.furnitures.filter((furniture) => furniture.model.id !== this.roomFurniture.model.id && furniture.logic instanceof RoomFurnitureBattleBanzaiRandomTeleportLogic);

        return teleports[Math.floor(Math.random() * teleports.length)];
    }
}
