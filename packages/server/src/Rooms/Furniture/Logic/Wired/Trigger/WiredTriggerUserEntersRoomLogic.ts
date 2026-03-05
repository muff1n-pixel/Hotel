import RoomFurniture from "../../../RoomFurniture.js";
import RoomUser from "../../../../Users/RoomUser.js";
import WiredLogic from "../WiredLogic.js";

export default class WiredTriggerUserEntersRoomLogic extends WiredLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleUserEnteredRoom(roomUser: RoomUser): Promise<void> {
        if(this.roomFurniture.model.data?.wiredUserSpecifier?.match === "user") {
            if(roomUser.user.model.name === this.roomFurniture.model.data?.wiredUserSpecifier.matchUser) {
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
