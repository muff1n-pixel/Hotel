import { randomUUID } from "crypto";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import { UseRoomFurnitureData } from "@pixel63/events";
import { game } from "../../../index.js";

export default class RoomFurnitureTraxLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
        if(!roomUser.hasRights()) {
            return;
        }

        if(this.roomFurniture.model.animation === 1) {
            await this.roomFurniture.setAnimation(0);

            return;
        }

        if(!this.roomFurniture.model.data?.trax?.playlist.length) {
            return;
        }

        await this.roomFurniture.setAnimation(1);
    }

    async handleActionsInterval(): Promise<void> {

    }
}
