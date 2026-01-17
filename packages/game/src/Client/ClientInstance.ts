import registerRoomEvents from "@Client/Room/Events/RoomEvents";
import RoomInstance from "./Room/RoomInstance";

export default class ClientInstance extends EventTarget {
    public roomInstance?: RoomInstance;

    constructor(public readonly element: HTMLElement) {
        super();

        element.style.background = "#9ED5EC";

        registerRoomEvents(this);
    }

    addEventListener<T>(type: string, callback: (event: T) => void | null, options?: AddEventListenerOptions | boolean): void {
        super.addEventListener(type, callback as EventListener, options);
    }

    removeEventListener<T>(type: string, callback: (event: T) => void | null, options?: EventListenerOptions | boolean): void {
        super.removeEventListener(type, callback as EventListener, options);
    }
}
