import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";
import RoomUser from "../../../../Users/RoomUser";

export default class WiredTriggerUserClickFurniLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }
    
    public async handleUserClicksFurniture(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void> {
        if(this.roomFurniture.model.data?.wiredFurnitureSelection?.furnitureSource === "list" && this.roomFurniture.model.data?.wiredFurnitureSelection.furnitureIds.length) {
            if(this.roomFurniture.model.data.wiredFurnitureSelection.furnitureIds.includes(roomFurniture.model.id)) {
                await this.setActive();
                
                this.handleTrigger({ roomUser, roomFurniture }).catch(console.error);
            }
        }
    }
}
