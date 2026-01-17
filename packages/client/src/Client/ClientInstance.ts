import registerFigureEvents from "@Client/Figure/Events/FigureEvents";
import registerFurnitureEvents from "@Client/Furniture/Events/FurnitureEvents";
import registerRoomEvents from "@Client/Room/Events/RoomEvents";
import registerUserInterfaceRoomRenderer from "@Client/Room/UserInterface/CreateRoomRenderer";
import registerRoomInventoryEvents from "@Client/Room/UserInterface/StartPlacingFurnitureInRoom";
import { TypedEventTarget } from "@Shared/Interfaces/TypedEventTarget";
import WebSocketClient from "@Shared/WebSocket/WebSocketClient";
import RoomInstance from "./Room/RoomInstance";

export default class ClientInstance {
    public roomInstance?: RoomInstance;

    constructor(public readonly element: HTMLElement, public readonly internalEventTarget: TypedEventTarget, public readonly webSocketClient: WebSocketClient) {
        registerRoomEvents(this);
        registerUserInterfaceRoomRenderer(this);
        registerFigureEvents(this);
        registerFurnitureEvents(this);
        registerRoomInventoryEvents(this);
    }
}
