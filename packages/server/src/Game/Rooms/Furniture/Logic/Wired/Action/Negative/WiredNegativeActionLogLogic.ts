import RoomFurniture from "../../../../RoomFurniture";
import { WiredTriggerOptions } from "../../WiredLogic";
import { RoomWiredLogLevel } from "../../../../../Wired/Interfaces/RoomWiredLogLevel";
import WiredNegativeActionLogic from "../../WiredNegativeActionLogic";

export default class WiredNegativeActionLogLogic extends WiredNegativeActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionLog) {
            return;
        }

        this.roomWired.addLog(this.roomFurniture.model.data.wiredActionLog.level as RoomWiredLogLevel, "", this.roomFurniture.model.data.wiredActionLog.message);
    }
}
