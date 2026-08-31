import { UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";

export default class RoomFurniturePetFoodLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
        if(!roomUser.hasRights()) {
            console.warn("User does not have rights.");

            return;
        }

        this.roomFurniture.setAnimation(0);
    }
}
