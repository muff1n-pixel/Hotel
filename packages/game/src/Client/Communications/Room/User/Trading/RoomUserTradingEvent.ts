import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { clientInstance } from "@Game/index";
import { RoomUserData, RoomUserTradingData } from "@pixel63/events";

export default class RoomUserTradingEvent implements ProtobuffListener<RoomUserTradingData> {
    async handle(payload: RoomUserTradingData) {
        clientInstance.roomUserTrading.value = payload;

        if(!clientInstance.dialogs.value.some((dialog) => dialog.id === "room-user-trading")) {
            clientInstance.dialogs.value.push({
                id: "room-user-trading",
                type: "room-user-trading",
                data: null
            });

            clientInstance.dialogs.update();
        }
    }
}
