import { UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";

export default class RoomFurnitureLightingLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
        if(!roomUser.hasRights()) {
            console.warn("User does not have rights.");
            
            return;
        }

        if(payload.animation === undefined) {
            return;
        }
        
        this.roomFurniture.setAnimation(payload.animation);

        await this.roomFurniture.room.handleUserUseFurniture(roomUser, this.roomFurniture);
    }

    async handleActionsInterval(): Promise<void> {
        
    }
}