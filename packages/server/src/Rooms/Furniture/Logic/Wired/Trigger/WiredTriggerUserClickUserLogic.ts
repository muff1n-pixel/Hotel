import RoomFurniture from "../../../RoomFurniture.js";
import WiredTriggerLogic from "../WiredTriggerLogic.js";
import RoomUser from "../../../../Users/RoomUser.js";

export default class WiredTriggerUserClickUserLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }
    
    public async handleUserClickUser(roomUser: RoomUser, targetUser: RoomUser): Promise<void> {
        if(this.roomFurniture.model.data?.wiredUserSpecifier?.match === "user") {
            if(targetUser.user.model.name === this.roomFurniture.model.data.wiredUserSpecifier.matchUser) {
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
