import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomLockData } from "@pixel63/events";

export default class RoomLockEvent implements ProtobuffListener<RoomLockData> {
    async handle(payload: RoomLockData) {
        switch(payload.roomLock) {
            case "bell": {
                clientInstance.dialogs.value = clientInstance.dialogs.value?.filter((dialog) => dialog.id !== payload.roomId && dialog.type !== "room-doorbell");

                clientInstance.dialogs.value!.push({
                    id: payload.roomId,
                    type: "room-doorbell",
                    data: payload
                });

                clientInstance.dialogs.update();

                return;
            }

            case "password": {
                clientInstance.dialogs.value = clientInstance.dialogs.value?.filter((dialog) => dialog.id !== payload.roomId && dialog.type !== "room-password");

                clientInstance.dialogs.value!.push({
                    id: payload.roomId,
                    type: "room-password",
                    data: payload,
                });

                clientInstance.dialogs.update();

                return;
            }
        }
    }
}
