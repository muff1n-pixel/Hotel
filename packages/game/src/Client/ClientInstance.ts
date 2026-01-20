import registerRoomEvents from "@Client/Room/Events/RoomEvents";
import RoomInstance from "./Room/RoomInstance";
import RoomFurnitureEvent from "@Client/Communications/Room/Furniture/RoomFurnitureEvent";
import { webSocketClient } from "..";
import { RoomFurnitureEventData } from "@Shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";

type Listener<T> = (value: T | undefined) => void;

export default class ClientInstance extends EventTarget {
    private _roomInstance?: RoomInstance;
    private listeners = new Set<Listener<RoomInstance>>();

    get roomInstance() {
        return this._roomInstance;
    }

    set roomInstance(value: RoomInstance | undefined) {
        this._roomInstance = value;

        this.listeners.forEach((listener) => listener(value));
    }

    subscribe(listener: Listener<RoomInstance>) {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }

    constructor(public readonly element: HTMLElement) {
        super();

        //element.style.background = "#9ED5EC";

        registerRoomEvents(this);

        webSocketClient.addEventListener<WebSocketEvent<RoomFurnitureEventData>>("RoomFurnitureEvent", (event) => new RoomFurnitureEvent().handle(event));
    }

    addEventListener<T>(type: string, callback: (event: T) => void | null, options?: AddEventListenerOptions | boolean): void {
        super.addEventListener(type, callback as EventListener, options);
    }

    removeEventListener<T>(type: string, callback: (event: T) => void | null, options?: EventListenerOptions | boolean): void {
        super.removeEventListener(type, callback as EventListener, options);
    }
}
