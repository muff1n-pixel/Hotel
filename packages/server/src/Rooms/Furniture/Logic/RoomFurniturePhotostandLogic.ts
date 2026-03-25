import { UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";

export default class RoomFurniturePhotostandLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {
        this.roomFurniture.setAnimation(1).catch(console.error);
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
    }

    async handleUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        if(this.roomFurniture.model.direction === null) {
            return;
        }

        if(roomUser.path.path) {
            return;
        }

        roomUser.path.setPosition(roomUser.position, this.roomFurniture.model.direction);
    }
}
