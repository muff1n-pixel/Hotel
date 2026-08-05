import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomUserFrozenEffect } from "../../../../Users/Interfaces/RoomUserFrozenEffect";

export default class WiredActionFreezeLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionFreeze) {
            return;
        }

        if(!options?.roomUser) {
            return;
        }

        options.roomUser.setFrozen(true, this.getFrozenEffect(), this.roomFurniture.model.data.wiredActionFreeze.unfreezeWhenTeleporting);

        await this.setActive();
    }

    private getFrozenEffect() {
        switch(this.roomFurniture.model.data?.wiredActionFreeze?.effect) {
            case "frozen":
                return RoomUserFrozenEffect.FROZEN;

            case "x-ray":
                return RoomUserFrozenEffect.XRAY;

            case "easterchick":
                return RoomUserFrozenEffect.EASTERCHICKS;

            case "sandtrap":
                return RoomUserFrozenEffect.HEADONTHEGROUND;
        }

        return undefined;
    }
}
