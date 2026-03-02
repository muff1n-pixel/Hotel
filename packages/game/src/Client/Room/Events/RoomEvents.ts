import ClientInstance from "@Client/ClientInstance";
import RoomInstance from "../RoomInstance";
import { webSocketClient } from "../../..";
import { RoomLoadData, RoomReadyData } from "@pixel63/events";

export default function registerRoomEvents(clientInstance: ClientInstance) {
    webSocketClient.addProtobuffListener(RoomLoadData, {
        async handle(payload: RoomLoadData) {
            if(clientInstance.roomInstance.value) {
                clientInstance.roomInstance.value.terminate();

                clientInstance.roomInstance.value = undefined;
                //throw new Error("TODO: room is already loaded!!");
            }

            clientInstance.roomInstance.value = new RoomInstance(clientInstance, payload);

            webSocketClient.sendProtobuff(RoomReadyData, RoomReadyData.create({}));
        },
    })
}
