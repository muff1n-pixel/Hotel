import registerRoomEvents from "@Client/Room/Events/RoomEvents";
import RoomInstance from "./Room/RoomInstance";
import RoomFurnitureEvent from "@Client/Communications/Room/Furniture/RoomFurnitureEvent";
import { webSocketClient } from "..";
import { RoomFurnitureEventData } from "@Shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { RoomStructureEventData } from "@Shared/Communications/Responses/Rooms/RoomStructureEventData";
import RoomStructureEvent from "@Client/Communications/Room/RoomStructureEvent";
import { UserActionEventData } from "@Shared/Communications/Responses/Rooms/Users/UserActionEventData";
import UserActionEvent from "@Client/Communications/Room/User/UserActionEvent";
import ObservableProperty from "@Client/Utilities/ObservableProperty";
import { RoomChatStyleData, RoomChatStylesEventData } from "@Shared/Communications/Responses/Rooms/Chat/Styles/RoomChatStylesEventData";
import { UserFigureConfigurationEventData } from "@Shared/Communications/Responses/Rooms/Users/UserFigureConfigurationEventData";
import UserFigureConfigurationEvent from "@Client/Communications/Room/User/UserFigureConfigurationEvent";
import { Dialog } from "../UserInterface/contexts/AppContext";

export default class ClientInstance extends EventTarget {
    public roomInstance = new ObservableProperty<RoomInstance>();
    public roomChatStyles = new ObservableProperty<RoomChatStyleData[]>();
    public dialogs = new ObservableProperty<Dialog[]>([]);

    constructor(public readonly element: HTMLElement) {
        super();

        //element.style.background = "#9ED5EC";

        registerRoomEvents(this);

        webSocketClient.addEventListener<WebSocketEvent<RoomFurnitureEventData>>("RoomFurnitureEvent", (event) => new RoomFurnitureEvent().handle(event));
        webSocketClient.addEventListener<WebSocketEvent<RoomStructureEventData>>("RoomStructureEvent", (event) => new RoomStructureEvent().handle(event));
        webSocketClient.addEventListener<WebSocketEvent<UserActionEventData>>("UserActionEvent", (event) => new UserActionEvent().handle(event));
        webSocketClient.addEventListener<WebSocketEvent<UserFigureConfigurationEventData>>("UserFigureConfigurationEvent", (event) => new UserFigureConfigurationEvent().handle(event));

        
        webSocketClient.addEventListener<WebSocketEvent<RoomChatStylesEventData>>("RoomChatStylesEvent", (event) => {
            this.roomChatStyles.value = event.data.roomChatStyles;
        });
    }

    addEventListener<T>(type: string, callback: (event: T) => void | null, options?: AddEventListenerOptions | boolean): void {
        super.addEventListener(type, callback as EventListener, options);
    }

    removeEventListener<T>(type: string, callback: (event: T) => void | null, options?: EventListenerOptions | boolean): void {
        super.removeEventListener(type, callback as EventListener, options);
    }
}
