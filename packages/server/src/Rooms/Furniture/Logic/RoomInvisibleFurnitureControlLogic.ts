import { UseRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData.js";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";

export default class RoomInvisibleFurnitureControlLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser): Promise<void> {
        if(!roomUser.hasRights()) {
            console.warn("User does not have rights.");

            return;
        }

        const animation = (this.roomFurniture.model.animation === 0)?(1):(0);

        const allControllers = this.roomFurniture.room.furnitures.filter((furniture) => furniture.model.furniture.interactionType === this.roomFurniture.model.furniture.interactionType);

        for(const furniture of allControllers) {
            if(furniture.model.animation !== animation) {
                furniture.setAnimation(animation);
            }
        }

        await this.roomFurniture.room.handleUserUseFurniture(roomUser, this.roomFurniture);
    }

    async handleActionsInterval(): Promise<void> {
        
    }
}