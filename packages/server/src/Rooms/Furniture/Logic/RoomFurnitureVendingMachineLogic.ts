import { UseRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData.js";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";

export default class RoomFurnitureVendingMachineLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser, event: UseRoomFurnitureEventData): Promise<void> {
        if(!this.roomFurniture.model.furniture.customParams?.length) {
            console.warn("Furniture does not have any custom params.");

            return;
        }

        const offsetPosition = this.roomFurniture.getOffsetPosition(1);

        if(offsetPosition.row !== roomUser.position.row || offsetPosition.column !== roomUser.position.column) {
            await new Promise<void>((resolve, reject) => {
                roomUser.walkTo(offsetPosition, undefined, resolve, reject);
            });
        }

        await this.roomFurniture.setAnimation(1);

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });

        await this.roomFurniture.setAnimation(0);

        const carryItem = this.roomFurniture.model.furniture.customParams[Math.floor(Math.random() * this.roomFurniture.model.furniture.customParams.length)];

        if(!carryItem) {
            console.warn("No carry item was able to be retrieved.");

            return;
        }

        roomUser.removeAction("AvatarEffect");
        roomUser.addAction(`CarryItem.${carryItem}`);
    }

    async handleActionsInterval(): Promise<void> {
        
    }
}