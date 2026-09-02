import { UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import RoomActor from "../../Actor/RoomActor.js";

export default class RoomFurnitureWaterLogic implements RoomFurnitureLogic {
    private roomUsersSplashing: RoomUser[] = [];

    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async handleBeforeActorWalksOn(roomActor: RoomActor): Promise<void> {
        if(!(roomActor instanceof RoomUser)) {
            return;
        }

        roomActor.pose.setEffect("AvatarEffect.28");

        this.roomUsersSplashing.push(roomActor);
    }

    async handleBeforeUserWalksOff(roomUser: RoomUser, newRoomFurniture: RoomFurniture[]): Promise<void> {
        if(!newRoomFurniture.some((furniture) => (furniture.logic instanceof RoomFurnitureWaterLogic))) {
            roomUser.pose.removeEffect();
        }
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
        for(const roomUser of this.roomUsersSplashing) {
            roomUser.pose.removeEffect();
            
            roomUser.pose.setEffect("AvatarEffect.29");
        }

        this.roomUsersSplashing = [];
    }
}
