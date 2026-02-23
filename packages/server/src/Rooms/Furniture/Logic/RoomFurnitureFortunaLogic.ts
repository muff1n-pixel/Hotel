import { game } from "../../../index.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { UseRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData.js";

export default class RoomFurnitureFortunaLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    // Animation 14 - 11 is the final pick (left to right)
    // Animation 24 - 21 is for the slow down (left to right)
    // Animation 32 is for the initial spin
    async use(roomUser: RoomUser, event: UseRoomFurnitureEventData): Promise<void> {
        if(this.roomFurniture.model.animation !== 0) {
            await this.roomFurniture.setAnimation(0);

            return;
        }

        await this.roomFurniture.setAnimation(32);

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });

        // Check if the fortuna has been closed while it was rolling
        // @ts-ignore: This comparison appears to be unintentional because the types '0' and '1' have no overlap.
        if(this.roomFurniture.model.animation !== 32) {
            return;
        }

        const randomSeat = Math.floor(Math.random() * 4);

        await this.roomFurniture.setAnimation(21 + randomSeat);

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 6000);
        });

        // Check if the fortuna has been closed while it was rolling
        // @ts-ignore: This comparison appears to be unintentional because the types '0' and '1' have no overlap.
        if(this.roomFurniture.model.animation !== 21 + randomSeat) {
            return;
        }

        await this.roomFurniture.setAnimation(11 + randomSeat);
    }

    async handleActionsInterval(): Promise<void> {
        
    }
}