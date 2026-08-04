import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";
import RoomUser from "../../../../Users/RoomUser";
import { WiredTriggerOptions } from "../WiredLogic";

export default class WiredTriggerStateChangedLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }
    
    public async handleUserUsesFurniture(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void> {
        this.handleExecution({ roomFurniture, roomUser });
    }

    public shouldTrigger(options?: WiredTriggerOptions): boolean {
        if(!options?.roomFurniture) {
            return false;
        }

        if(this.roomFurniture.model.data?.wiredFurnitureSelection?.furnitureSource === "list" && this.roomFurniture.model.data?.wiredFurnitureSelection.furnitureIds.length) {
            if(this.roomFurniture.model.data.wiredFurnitureSelection.furnitureIds.includes(options?.roomFurniture.model.id)) {
                return true;
            }
        }

        return true;
    }
}
