import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomClickConfigurationData } from "@pixel63/events";

export default class WiredActionClickConfigurationLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionClickConfiguration) {
            return;
        }

        this.roomFurniture.room.clickConfiguration = RoomClickConfigurationData.create({
            enabled: true,
            userBehaviour: this.roomFurniture.model.data.wiredActionClickConfiguration.userBehaviour,
            furnitureBehaviour: this.roomFurniture.model.data.wiredActionClickConfiguration.furnitureBehaviour,
        });

        this.roomFurniture.room.sendProtobuff(RoomClickConfigurationData, this.roomFurniture.room.clickConfiguration);

        await this.setActive();
    }
}
