import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerUserWalksOffFurnitureData } from "@shared/Interfaces/Room/Furniture/Wired/Trigger/WiredTriggerUserWalksOffFurnitureData";
import WiredTriggerLogic from "../WiredTriggerLogic";
import RoomUser from "../../../../Users/RoomUser";

export default class WiredTriggerUserWalksOffFurnitureLogic extends WiredTriggerLogic<WiredTriggerUserWalksOffFurnitureData> {
    constructor(roomFurniture: RoomFurniture<WiredTriggerUserWalksOffFurnitureData>) {
        super(roomFurniture);
    }

    public async handleUserWalksOffFurniture(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void> {
        if(this.roomFurniture.model.data?.furnitureSource === "list" && this.roomFurniture.model.data?.furnitureIds.length) {
            if(this.roomFurniture.model.data.furnitureIds.includes(roomFurniture.model.id)) {
                this.lastTriggered = performance.now();
                this.roomFurniture.setAnimation(101);
                
                this.handleTrigger(roomUser);
            }
        }
    }
}
