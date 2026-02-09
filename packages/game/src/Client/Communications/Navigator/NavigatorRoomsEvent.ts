import IncomingEvent from "@Client/Communications/IncomingEvent";
import { NavigatorRoomsEventData } from "@Shared/Communications/Responses/Navigator/NavigatorRoomsEventData";
import { clientInstance } from "../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";

export default class NavigatorRoomsEvent implements IncomingEvent<WebSocketEvent<NavigatorRoomsEventData>> {
    async handle(event: WebSocketEvent<NavigatorRoomsEventData>) {
        clientInstance.navigator.value = event.data;
    }
}
