import { game } from "../../../index.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";

export default class RoomFurnitureTeleportLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser): Promise<void> {
        if(this.roomFurniture.model.animation !== 0) {
            return;
        }

        const offsetPosition = this.roomFurniture.getOffsetPosition(1);

        if(offsetPosition.row !== roomUser.position.row || offsetPosition.column !== roomUser.position.column) {
            await new Promise<void>((resolve, reject) => {
                roomUser.walkTo(offsetPosition, undefined, resolve, reject);
            });

            console.log("Finished");
        }

        await this.roomFurniture.setAnimation(1);

        await new Promise<void>((resolve, reject) => {
            roomUser.walkTo(this.roomFurniture.model.position, true, resolve, reject);
        });

        await this.roomFurniture.setAnimation(2);

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });

        await this.roomFurniture.setAnimation(0);

        const targetUserFurniture = await UserFurnitureModel.findOne({
            where: {
                id: this.roomFurniture.model.data
            },
            include: [
                {
                    model: RoomModel,
                    as: "room"
                }
            ]
        });

        if(!targetUserFurniture) {
            throw new Error("Target user furniture does not exist.");
        }

        if(!targetUserFurniture.room) {
            throw new Error("Target user furniture is not placed in any room.");
        }

        const targetRoom = await game.roomManager.getOrLoadRoomInstance(targetUserFurniture.room.id);

        if(!targetRoom) {
            throw new Error("Target room does not exist.");
        }

        const targetFurniture = targetRoom.furnitures.find((furniture) => furniture.model.id === this.roomFurniture.model.data);

        if(!targetFurniture) {
            throw new Error("Target room furniture is not loaded.");
        }

        if(roomUser.room.model.id !== targetRoom.model.id) {
            roomUser.disconnect();
            
            roomUser = targetRoom.addUserClient(roomUser.user, targetFurniture.model.position);
        }

        await targetFurniture.setAnimation(2);

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });

        roomUser.setPosition({
            ...targetFurniture.model.position,
            depth: targetFurniture.model.position.depth + 0.01
        });

        await targetFurniture.setAnimation(1);

        const targetOffsetPosition = targetFurniture.getOffsetPosition(1);

        await new Promise<void>((resolve, reject) => {
            roomUser.walkTo(targetOffsetPosition, undefined, resolve, reject);
        });

        await targetFurniture.setAnimation(0);
    }

    async handleActionsInterval(): Promise<void> {
        
    }
}