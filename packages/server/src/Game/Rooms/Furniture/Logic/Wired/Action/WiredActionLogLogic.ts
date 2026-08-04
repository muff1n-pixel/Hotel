import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomBotsData } from "@pixel63/events";
import { RoomWiredLogLevel } from "../../../../Wired/Interfaces/RoomWiredLogLevel";

export default class WiredActionLogLogic extends WiredActionLogic {
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
