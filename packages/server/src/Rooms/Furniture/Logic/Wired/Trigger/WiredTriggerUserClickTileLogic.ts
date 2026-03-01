import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";
import RoomUser from "../../../../Users/RoomUser";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition";

export default class WiredTriggerUserClickTileLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }
    
    public async handleUserClicksTile(roomUser: RoomUser, position: RoomPosition): Promise<void> {
        if(this.roomFurniture.model.data?.wiredFurnitureSelection?.furnitureSource === "list" && this.roomFurniture.model.data?.wiredFurnitureSelection.furnitureIds.length) {
            if(this.roomFurniture.model.data.wiredFurnitureSelection.furnitureIds.some((furnitureId) => this.roomFurniture.room.furnitures.find((furniture) => furniture.model.id === furnitureId)?.isPositionInside(position))) {
                this.setActive();
                
                this.handleTrigger({
                    roomUser
                });
            }
        }
    }
}
