import RoomUser from "../../../../Users/RoomUser";
import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerUserPerformsActionLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleUserAction(roomUser: RoomUser, actionId: string): Promise<void> {
        const actionName = actionId.split('.')[0];
        const actionNumber = actionId.split('.')[1];

        console.log(this.roomFurniture.model.data?.wiredTriggerUserPerformsAction?.action);
        console.log(actionName);

        if(this.roomFurniture.model.data?.wiredTriggerUserPerformsAction?.action === actionName) {
            if(this.roomFurniture.model.data?.wiredTriggerUserPerformsAction?.filter && ["Dance", "Sign"].includes(this.roomFurniture.model.data.wiredTriggerUserPerformsAction?.action)) {
                if(actionNumber && parseInt(actionNumber) === this.roomFurniture.model.data.wiredTriggerUserPerformsAction?.filterId) {
                    this.setActive();
                    this.handleTrigger({
                        roomUser
                    });
                }
            }
            else {
                this.setActive();
                this.handleTrigger({
                    roomUser
                });
            }
        }
    }
}
