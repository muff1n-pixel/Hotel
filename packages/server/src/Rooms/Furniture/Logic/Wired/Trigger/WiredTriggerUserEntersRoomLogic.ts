import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";
import WiredLogic from "../WiredLogic";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerUserEntersRoomLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleUserEnteredRoom(roomUser: RoomUser): Promise<void> {
        if(this.roomFurniture.model.data?.wiredUserSpecifier?.match === "user") {
            if(roomUser.user.model.name === this.roomFurniture.model.data?.wiredUserSpecifier.matchUser) {
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
