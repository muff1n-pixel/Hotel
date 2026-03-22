import { UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../../Users/RoomUser.js";
import RoomFurniture from "../../../RoomFurniture.js";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic.js";

export default class RoomFurnitureFreezeExitLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {
        this.roomFurniture.setAnimation(0);
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
        
    }
}
