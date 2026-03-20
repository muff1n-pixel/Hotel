import { clientInstance } from "../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { HotelAlertData } from "@pixel63/events";

export default class HotelAlertEvent implements ProtobuffListener<HotelAlertData> {
    async handle(payload: HotelAlertData) {
        clientInstance.dialogs.value!.push({
            id: Math.random().toString(),
            type: payload.dialogType ?? "alert",
            data: payload,
        });

        clientInstance.dialogs.update();
    }
}
