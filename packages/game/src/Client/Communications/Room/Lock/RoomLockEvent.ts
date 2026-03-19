import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomLockData } from "@pixel63/events";

export default class RoomLockEvent implements ProtobuffListener<RoomLockData> {
    async handle(payload: RoomLockData) {
        switch(payload.room?.lock) {
            case "bell": {
                clientInstance.dialogs.value = clientInstance.dialogs.value?.filter((dialog) => dialog.id !== payload.room?.id && dialog.type !== "room-doorbell");

                clientInstance.dialogs.value!.push({
                    id: payload.room.id,
                    type: "room-doorbell",
                    data: payload.room,
                });

                clientInstance.dialogs.update();

                return;
            }
        }
    }
}
