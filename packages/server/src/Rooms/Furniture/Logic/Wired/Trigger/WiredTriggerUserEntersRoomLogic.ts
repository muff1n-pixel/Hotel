import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerUserEntersRoomLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleUserEnteredRoom(roomUser: RoomUser): Promise<void> {
        this.handleExecution({ roomUser });
    }

    public shouldTrigger(options?: WiredTriggerOptions): boolean {
        if(!options?.roomUser) {
            return false;
        }

        if(this.roomFurniture.model.data?.wiredUserSpecifier?.match === "user") {
            if(options.roomUser.user.model.name === this.roomFurniture.model.data?.wiredUserSpecifier.matchUser) {
                return true;
            }
       
            return false;
        }

        return true;
    }
}
