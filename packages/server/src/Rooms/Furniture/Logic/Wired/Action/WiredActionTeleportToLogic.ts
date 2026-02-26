import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";
import WiredLogic from "../WiredLogic";
import { WiredActionTeleportToFurnitureData } from "@shared/Interfaces/Room/Furniture/Wired/Action/WiredActionTeleportToFurnitureData";

export type DelayedMessageData = {
    userId: string;
    timestamp: number;
};

export default class WiredActionTeleportToLogic extends WiredLogic<WiredActionTeleportToFurnitureData> {
    
    constructor(roomFurniture: RoomFurniture<WiredActionTeleportToFurnitureData>) {
        super(roomFurniture);
    }

    public async handleTrigger(roomUser?: RoomUser): Promise<void> {
        if(roomUser) {
            if(this.roomFurniture.model.data?.furnitureIds.length) {
                const availableFurnitures = this.roomFurniture.room.furnitures.filter((furniture) => this.roomFurniture.model.data?.furnitureIds.includes(furniture.model.id));

                const randomFurniture = availableFurnitures[Math.floor(Math.random() * availableFurnitures.length)];

                if(randomFurniture) {
                    this.lastTriggered = performance.now();
                    this.roomFurniture.setAnimation(101);
                    
                    roomUser.path.teleportTo(randomFurniture.model.position);
                }
            }
        }

        return super.handleTrigger(roomUser);
    }
}