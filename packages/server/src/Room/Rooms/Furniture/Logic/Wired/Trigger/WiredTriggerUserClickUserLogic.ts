import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";
import RoomUser from "../../../../Users/RoomUser";
import { WiredTriggerOptions } from "../WiredLogic";

export default class WiredTriggerUserClickUserLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }
    
    public async handleUserClickUser(roomUser: RoomUser, targetUser: RoomUser): Promise<void> {
        this.handleExecution({ roomUser }, targetUser);
    }

    public shouldTrigger(options?: WiredTriggerOptions, targetUser?: RoomUser): boolean {
        if(this.roomFurniture.model.data?.wiredUserSpecifier?.match === "user") {
            if(targetUser?.user.model.name === this.roomFurniture.model.data.wiredUserSpecifier.matchUser) {
                return true;
            }
        }
        else {
            return true;
        }

        return false;
    }
}
