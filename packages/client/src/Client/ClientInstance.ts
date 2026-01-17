import registerRoomEvents from "@Client/Room/Events/RoomEvents";
import { TypedEventTarget } from "@Shared/Interfaces/TypedEventTarget";
import WebSocketClient from "../WebSocket/WebSocketClient";
import RoomInstance from "./Room/RoomInstance";

export default class ClientInstance {
    public roomInstance?: RoomInstance;

    constructor(public readonly element: HTMLElement, public readonly internalEventTarget: TypedEventTarget, public readonly webSocketClient: WebSocketClient) {
        registerRoomEvents(this);
    }
}
