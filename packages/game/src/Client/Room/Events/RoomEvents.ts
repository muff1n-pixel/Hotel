import ClientInstance from "@Client/ClientInstance";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import RoomInstance from "../RoomInstance";
import { webSocketClient } from "../../..";
import { LoadRoomEventData } from "@Shared/Communications/Responses/Rooms/LoadRoomEventData";

export default function registerRoomEvents(clientInstance: ClientInstance) {
    webSocketClient.addEventListener<WebSocketEvent<LoadRoomEventData>>("LoadRoomEvent", (event) => {
        if(clientInstance.roomInstance.value) {
            clientInstance.roomInstance.value.terminate();

            clientInstance.roomInstance.value = undefined;
            //throw new Error("TODO: room is already loaded!!");
        }

        clientInstance.roomInstance.value = new RoomInstance(clientInstance, event.data);
    });
}
