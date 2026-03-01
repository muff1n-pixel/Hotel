import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import { RoomPositionData, UseRoomFurnitureData } from "@pixel63/events";

export default class RoomFurnitureDiceLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
        const relativePosition: Omit<RoomPositionData, "depth"> = RoomPositionData.create({
            row: this.roomFurniture.model.position.row - roomUser.position.row,
            column: this.roomFurniture.model.position.column - roomUser.position.column,
        });

        // Check if the user is too far away
        if(Math.abs(relativePosition.row) > 1 || Math.abs(relativePosition.column) > 1) {
            console.log("User is too far away, " + JSON.stringify(relativePosition));

            roomUser.path.walkTo(this.roomFurniture.getOffsetPosition(1));

            return;
        }

        await this.roomFurniture.room.handleUserUseFurniture(roomUser, this.roomFurniture);

        // Close the dice if deactivating
        if(payload.tag === "deactivate" && this.roomFurniture.model.animation !== 0) {
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