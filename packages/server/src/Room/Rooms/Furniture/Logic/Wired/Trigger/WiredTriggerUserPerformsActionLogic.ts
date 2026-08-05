import RoomUser from "../../../../Users/RoomUser";
import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerUserPerformsActionLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleUserAction(roomUser: RoomUser, actionId: string): Promise<void> {
        this.handleExecution({ roomUser }, actionId);
    }

    public shouldTrigger(options?: WiredTriggerOptions, actionId?: string): boolean {
        if(!actionId) {
            return false;
        }

        const actionName = actionId.split('.')[0];
        const actionNumber = actionId.split('.')[1];

        if(this.roomFurniture.model.data?.wiredTriggerUserPerformsAction?.action === actionName) {
            if(this.roomFurniture.model.data?.wiredTriggerUserPerformsAction?.filter && ["Dance", "Sign"].includes(this.roomFurniture.model.data.wiredTriggerUserPerformsAction?.action)) {
                if(actionNumber && parseInt(actionNumber) === this.roomFurniture.model.data.wiredTriggerUserPerformsAction?.filterId) {
                    return true;
                }
            }
            else {
                return true;
            }
        }

        return false;
    }
}
