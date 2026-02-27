import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerUserWalksOnFurnitureData } from "@shared/Interfaces/Room/Furniture/Wired/Trigger/WiredTriggerUserWalksOnFurnitureData";
import WiredTriggerLogic from "../WiredTriggerLogic";
import RoomUser from "../../../../Users/RoomUser";

export default class WiredTriggerUserWalksOnFurnitureLogic extends WiredTriggerLogic<WiredTriggerUserWalksOnFurnitureData> {
    constructor(roomFurniture: RoomFurniture<WiredTriggerUserWalksOnFurnitureData>) {
        super(roomFurniture);
    }

    public async handleUserWalksOnFurniture(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void> {
        if(this.roomFurniture.model.data?.furnitureSource === "list" && this.roomFurniture.model.data?.furnitureIds.length) {
            if(this.roomFurniture.model.data.furnitureIds.includes(roomFurniture.model.id)) {
                this.lastTriggered = performance.now();
                this.roomFurniture.setAnimation(101);
                
                this.handleTrigger(roomUser);
            }
        }
    }
}
