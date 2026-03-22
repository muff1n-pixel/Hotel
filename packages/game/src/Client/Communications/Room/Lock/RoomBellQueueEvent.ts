import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomBellQueueData } from "@pixel63/events";

export default class RoomBellQueueEvent implements ProtobuffListener<RoomBellQueueData> {
    async handle(payload: RoomBellQueueData) {
        clientInstance.dialogs.value = clientInstance.dialogs.value?.filter((dialog) => dialog.type !== "room-doorbell-queue");

        if(payload.users.length) {
            clientInstance.dialogs.value!.push({
                id: "room-doorbell-queue",
                type: "room-doorbell-queue",
                data: payload.users,
            });

            clientInstance.dialogs.update();
        }
    }
}
