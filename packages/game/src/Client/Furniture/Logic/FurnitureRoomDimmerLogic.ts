import Furniture from "@Client/Furniture/Furniture";
import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { clientInstance, webSocketClient } from "../../..";
import { UseRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData";
import { RoomFurnitureDimmerData } from "../../../UserInterface/components/Room/Furniture/Logic/Dimmer/RoomFurnitureDimmerDialog";

export default class FurnitureRoomDimmerLogic implements FurnitureLogic {
    constructor(private readonly furniture: Furniture, private readonly data: FurnitureData) {
    }

    isAvailable() {
        return true;
    }

    use(roomFurniture: RoomInstanceFurniture): void {
        this.removeExistingDialog();

        clientInstance.dialogs.value = clientInstance.dialogs.value?.concat([
            {
                id: Math.random().toString(),
                type: "room-furniture-logic",
                data: {
                    furniture: roomFurniture,
                    type: "furniture_roomdimmer"
                } satisfies RoomFurnitureDimmerData
            }
        ]);
    }

    private removeExistingDialog() {
        if(!clientInstance.dialogs.value) {
            return;
        }

        const existingIndex = clientInstance.dialogs.value.findIndex((dialog) => dialog.type === "room-furniture-logic");

        if(existingIndex === -1) {
            return;
        }

        clientInstance.dialogs.value.splice(existingIndex, 1);
    }
}
