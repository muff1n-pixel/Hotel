import { UseRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData.js";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";

export default class RoomFurnitureLightingLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser, event: UseRoomFurnitureEventData): Promise<void> {
        if(!roomUser.hasRights()) {
            console.warn("User does not have rights.");
            
            return;
        }

        if(event.animation === undefined) {
            return;
        }
        
        this.roomFurniture.setAnimation(event.animation);
    }

    async handleActionsInterval(): Promise<void> {
        
    }
}