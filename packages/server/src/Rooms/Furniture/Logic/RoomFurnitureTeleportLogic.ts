import { game } from "../../../index.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import { RoomPositionOffsetData } from "@pixel63/events";

export default class RoomFurnitureTeleportLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {
        this.roomFurniture.setAnimation(0);
    }

    private async handleUserEnterTeleporter(roomUser: RoomUser) {
        await this.roomFurniture.room.handleUserUseFurniture(roomUser, this.roomFurniture);

        this.roomFurniture.setAnimation(1);

        roomUser.path.walkTo(RoomPositionOffsetData.fromJSON(this.roomFurniture.model.position), true, () => this.handleUserEnteredTeleport(roomUser), () => this.handleUserCancelledEnteringTeleport(roomUser));
    }

    private async handleUserEnteredTeleport(roomUser: RoomUser) {
        const targetFurniture = await this.getTargetFurniture();

        if(!targetFurniture) {
            this.roomFurniture.setAnimation(1);

            const targetOffsetPosition = this.roomFurniture.getOffsetPosition(1);

            roomUser.path.walkTo(targetOffsetPosition, undefined, () => this.handleUserExitsTeleport(roomUser, this.roomFurniture), () => this.handleUserCancelledEnteringTeleport(roomUser));

            return;
        }

        this.roomFurniture.setAnimation(2);

        if(roomUser.room.model.id !== targetFurniture.room.model.id) {
            roomUser.disconnect();
            
            roomUser = targetFurniture.room.addUserClient(roomUser.user, targetFurniture.model.position);
        }

        targetFurniture.setAnimation(2);
        
        roomUser.path.setPosition({
            ...targetFurniture.model.position,
            depth: targetFurniture.model.position.depth + 0.01
        });

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });

        this.roomFurniture.setAnimation(0);

        targetFurniture.setAnimation(1);

        const targetOffsetPosition = targetFurniture.getOffsetPosition(1);

        roomUser.path.walkTo(targetOffsetPosition, undefined, () => this.handleUserExitsTeleport(roomUser, targetFurniture), () => this.handleUserCancelledEnteringTeleport(roomUser));
    }

    private handleUserExitsTeleport(roomUser: RoomUser, targetFurniture: RoomFurniture) {
        targetFurniture.setAnimation(0);
    }

    private async handleUserCancelledEnteringTeleport(roomUser: RoomUser) {
        this.roomFurniture.setAnimation(0);
    }

    private async getTargetFurniture() {
        if(!this.roomFurniture.model.data?.teleport?.furnitureId) {
            console.warn("Teleport does not have a second furniture.");
            
            return null;
        }

        const targetUserFurniture = await UserFurnitureModel.findOne({
            where: {
                id: this.roomFurniture.model.data?.teleport?.furnitureId
            },
            include: [
                {
                    model: RoomModel,
                    as: "room"
                }
            ]
        });

        if(!targetUserFurniture) {
            console.warn("Target user furniture does not exist.");
            
            return null;
        }

        if(!targetUserFurniture.room) {
            console.warn("Target user furniture is not placed in any room.");
            
            return null;
        }

        const targetRoom = await game.roomManager.getOrLoadRoomInstance(targetUserFurniture.room.id);

        if(!targetRoom) {
            console.warn("Target room does not exist.");
            
            return null;
        }

        const targetFurniture = targetRoom.furnitures.find((furniture) => furniture.model.id === this.roomFurniture.model.data?.teleport?.furnitureId);

        if(!targetFurniture) {
            console.warn("Target room furniture is not loaded.");
            
            return null;
        }

        return targetFurniture;
    }

    async use(roomUser: RoomUser): Promise<void> {
        if(this.roomFurniture.model.animation !== 0) {
            return;
        }

        const offsetPosition = this.roomFurniture.getOffsetPosition(1);

        if(offsetPosition.row !== roomUser.position.row || offsetPosition.column !== roomUser.position.column) {
            console.log("User is not in entrance position, starting walk to position");

            roomUser.path.walkTo(offsetPosition, undefined, () => this.handleUserEnterTeleporter(roomUser));

            return;
        }

        this.handleUserEnterTeleporter(roomUser);
    }

    async handleActionsInterval(): Promise<void> {
        
    }
}