import { game } from "../../../index.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { UseRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData.js";

export default class RoomFurnitureDiceLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser, event: UseRoomFurnitureEventData): Promise<void> {
        const relativePosition: Omit<RoomPosition, "depth"> = {
            row: this.roomFurniture.model.position.row - roomUser.position.row,
            column: this.roomFurniture.model.position.column - roomUser.position.column,
        };

        // Check if the user is too far away
        if(Math.abs(relativePosition.row) > 1 || Math.abs(relativePosition.column) > 1) {
            console.log("User is too far away, " + JSON.stringify(relativePosition));

            roomUser.walkTo(this.roomFurniture.getOffsetPosition(1));

            return;
        }

        // Close the dice if deactivating
        if(event.tag === "deactivate" && this.roomFurniture.model.animation !== 0) {
            await this.roomFurniture.setAnimation(0);

            return;
        }

        console.log("Rolling");
        await this.roomFurniture.setAnimation(-1);
        
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });

        // Check if the dice has been closed while it was rolling
        // @ts-ignore: This comparison appears to be unintentional because the types '0' and '1' have no overlap.
        if(this.roomFurniture.model.animation !== -1) {
            console.log("Dice is not rolling");
            return;
        }

        console.log("Rolled");
        await this.roomFurniture.setAnimation(1 + Math.floor(Math.random() * 6));
    }

    async handleActionsInterval(): Promise<void> {
        
    }
}