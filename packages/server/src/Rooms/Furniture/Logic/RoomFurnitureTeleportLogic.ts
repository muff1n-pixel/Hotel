import { game } from "../../../index.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import { RoomPositionOffsetData } from "@pixel63/events";

export default class RoomFurnitureTeleportLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser): Promise<void> {
        if(this.roomFurniture.model.animation !== 0) {
            return;
        }

        const offsetPosition = this.roomFurniture.getOffsetPosition(1);

        if(offsetPosition.row !== roomUser.position.row || offsetPosition.column !== roomUser.position.column) {
            console.log("User is not in entrance position, starting walk to position");

            await new Promise<void>((resolve, reject) => {
                roomUser.path.walkTo(offsetPosition, undefined, resolve, reject);
            });
        }

        await this.roomFurniture.room.handleUserUseFurniture(roomUser, this.roomFurniture);

        await this.roomFurniture.setAnimation(1);

        await new Promise<void>((resolve, reject) => {
            roomUser.path.walkTo(RoomPositionOffsetData.fromJSON(this.roomFurniture.model.position), true, resolve, reject);
        });

        await this.roomFurniture.setAnimation(2);

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });

        await this.roomFurniture.setAnimation(0);

        if(!this.roomFurniture.model.data?.teleport?.furnitureId) {
            console.warn("Teleport does not have a second furniture.");
            
            return;
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
            
            return;
        }

        if(!targetUserFurniture.room) {
            console.warn("Target user furniture is not placed in any room.");
            
            return;
        }


        if(roomUser.room.model.id !== targetUserFurniture.room.id) {
            roomUser.disconnect();

            await game.roomManager.addUserToRoom(roomUser.user, targetUserFurniture.room.id);
        }

        /*await targetFurniture.setAnimation(2);

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });

        roomUser.path.setPosition({
            ...targetFurniture.model.position,
            depth: targetFurniture.model.position.depth + 0.01
        });

        await targetFurniture.setAnimation(1);

        const targetOffsetPosition = targetFurniture.getOffsetPosition(1);

        await new Promise<void>((resolve, reject) => {
            roomUser.path.walkTo(targetOffsetPosition, undefined, resolve, reject);
        });

        await targetFurniture.setAnimation(0);*/
    }

    async handleActionsInterval(): Promise<void> {
        
    }
}