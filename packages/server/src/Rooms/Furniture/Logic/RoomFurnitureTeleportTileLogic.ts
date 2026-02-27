import { game } from "../../../index.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";

export default class RoomFurnitureTeleportTileLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser): Promise<void> {
        if(this.roomFurniture.model.animation !== 0) {
            return;
        }

        const offsetPosition = this.roomFurniture.getOffsetPosition(1);

        if(offsetPosition.row !== roomUser.position.row || offsetPosition.column !== roomUser.position.column) {
            roomUser.path.walkTo(offsetPosition, undefined);
        }
    }

    async handleUserWalksOn(roomUser: RoomUser): Promise<void> {
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
            console.warn("Target user furniture does not exist.");
            
            return;
        }

        if(!targetUserFurniture.room) {
            console.warn("Target user furniture is not placed in any room.");
            
            return;
        }

        const targetRoom = await game.roomManager.getOrLoadRoomInstance(targetUserFurniture.room.id);

        if(!targetRoom) {
            console.warn("Target room does not exist.");
            
            return;
        }

        const targetFurniture = targetRoom.furnitures.find((furniture) => furniture.model.id === this.roomFurniture.model.data);

        if(!targetFurniture) {
            console.warn("Target room furniture is not loaded.");
            
            return;
        }

        roomUser.path.path = undefined;

        if(roomUser.room.model.id !== targetRoom.model.id) {
            roomUser.disconnect();
            
            roomUser = targetRoom.addUserClient(roomUser.user, targetFurniture.model.position);
        }

        roomUser.path.setPosition({
            ...targetFurniture.model.position,
            depth: targetFurniture.model.position.depth + 0.01
        }, (targetFurniture.model.direction + 4) % 8);
    }
}