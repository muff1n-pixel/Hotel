import ClientInstance from "@Client/ClientInstance";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { LoadRoom } from "@Shared/WebSocket/Events/Rooms/LoadRoom";
import RoomInstance from "../RoomInstance";

export default function registerRoomEvents(clientInstance: ClientInstance) {
    clientInstance.webSocketClient.addEventListener<WebSocketEvent<LoadRoom>>("LoadRoom", (event) => {
        if(clientInstance.roomInstance) {
            throw new Error("TODO: room is already loaded!!");
        }

        clientInstance.roomInstance = new RoomInstance(clientInstance, event.data);
    });
}
