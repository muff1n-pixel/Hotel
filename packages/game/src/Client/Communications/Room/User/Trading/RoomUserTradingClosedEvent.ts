import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { clientInstance } from "@Game/index";
import { RoomUserData, RoomUserTradingClosedData, RoomUserTradingData } from "@pixel63/events";

export default class RoomUserTradingClosedEvent implements ProtobuffListener<RoomUserTradingClosedData> {
    async handle(payload: RoomUserTradingClosedData) {
        if(clientInstance.roomUserTrading.value?.userId === payload.userId) {
            clientInstance.dialogs.value = clientInstance.dialogs.value.filter((dialog) => dialog.id !== "room-user-trading");

            clientInstance.dialogs.update();
        }
    }
}
