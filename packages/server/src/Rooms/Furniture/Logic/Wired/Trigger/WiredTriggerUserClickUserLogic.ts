import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";
import RoomUser from "../../../../Users/RoomUser";

export default class WiredTriggerUserClickUserLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }
    
    public async handleUserClickUser(roomUser: RoomUser, targetUser: RoomUser): Promise<void> {
        if(this.roomFurniture.model.data?.wiredUserSpecifier?.match === "user") {
            if(targetUser.user.model.name === this.roomFurniture.model.data.wiredUserSpecifier.matchUser) {
                await this.setActive();
                
                this.handleTrigger({ roomUser }).catch(console.error);
            }
        }
        else {
            await this.setActive();
            
            this.handleTrigger({ roomUser }).catch(console.error);
        }
    }
}
