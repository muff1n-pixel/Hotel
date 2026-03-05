import RoomFurniture from "../../../RoomFurniture.js";
import WiredTriggerLogic from "../WiredTriggerLogic.js";
import RoomUser from "../../../../Users/RoomUser.js";
import { RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";

export default class WiredTriggerUserClickTileLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }
    
    public async handleUserClicksTile(roomUser: RoomUser, position: RoomPositionData): Promise<void> {
        if(this.roomFurniture.model.data?.wiredFurnitureSelection?.furnitureSource === "list" && this.roomFurniture.model.data?.wiredFurnitureSelection.furnitureIds.length) {
            if(this.roomFurniture.model.data.wiredFurnitureSelection.furnitureIds.some((furnitureId) => this.roomFurniture.room.furnitures.find((furniture) => furniture.model.id === furnitureId)?.isPositionInside(RoomPositionOffsetData.fromJSON(position)))) {
                this.setActive();
                
                this.handleTrigger({
                    roomUser
                });
            }
        }
    }
}
