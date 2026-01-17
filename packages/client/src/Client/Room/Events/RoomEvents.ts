import ClientInstance from "@Client/ClientInstance";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { LoadRoom } from "@Shared/WebSocket/Events/Rooms/LoadRoom";
import RoomInstance from "../RoomInstance";
import { webSocketClient } from "../../..";

export default function registerRoomEvents(clientInstance: ClientInstance) {
    webSocketClient.addEventListener<WebSocketEvent<LoadRoom>>("LoadRoom", (event) => {
        if(clientInstance.roomInstance) {
            throw new Error("TODO: room is already loaded!!");
        }

        clientInstance.roomInstance = new RoomInstance(clientInstance, event.data);
    });
}
