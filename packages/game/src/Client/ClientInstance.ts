import registerRoomEvents from "@Client/Room/Events/RoomEvents";
import RoomInstance from "./Room/RoomInstance";
import RoomFurnitureEvent from "@Client/Communications/Room/Furniture/RoomFurnitureEvent";
import { webSocketClient } from "..";
import { RoomFurnitureEventData } from "@Shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { RoomStructureEventData } from "@Shared/Communications/Responses/Rooms/RoomStructureEventData";
import RoomStructureEvent from "@Client/Communications/Room/RoomStructureEvent";
import ObservableProperty from "@Client/Utilities/ObservableProperty";
import { RoomChatStyleData, RoomChatStylesEventData } from "@Shared/Communications/Responses/Rooms/Chat/Styles/RoomChatStylesEventData";
import { UserFigureConfigurationEventData } from "@Shared/Communications/Responses/Rooms/Users/UserFigureConfigurationEventData";
import UserFigureConfigurationEvent from "@Client/Communications/Room/User/UserFigureConfigurationEvent";
import { Dialog } from "../UserInterface/contexts/AppContext";
import { RoomInformationEventData } from "@Shared/Communications/Responses/Rooms/RoomInformationEventData";
import RoomInformationEvent from "@Client/Communications/Room/RoomInformationEvent";
import { RoomUserRightsEventData } from "@Shared/Communications/Responses/Rooms/Users/RoomUserRightsEventData";
import UserEvent from "@Client/Communications/User/UserEvent";
import RoomUserRightsEvent from "@Client/Communications/Room/User/RoomUserRightsEvent";
import { RoomHistory } from "../UserInterface/components/Room/Toolbar/ToolbarRoomChat";
import { HotelEventData } from "@Shared/Communications/Responses/Hotel/HotelEventData";
import HotelEvent from "@Client/Communications/Hotel/HotelEvent";
import { NavigatorRoomsEventData } from "@Shared/Communications/Responses/Navigator/NavigatorRoomsEventData";
import NavigatorRoomsEvent from "@Client/Communications/Navigator/NavigatorRoomsEvent";
import { RoomCategoriesEventData } from "@Shared/Communications/Responses/Navigator/RoomCategoriesEventData";
import MoveRoomFurnitureEvent from "@Client/Communications/Room/Furniture/MoveRoomFurnitureEvent";
import { MoveRoomFurnitureEventData } from "@Shared/Communications/Responses/Rooms/Furniture/MoveRoomFurnitureEventData";
import { PermissionAction } from "@Shared/Interfaces/Permissions/PermissionMap";
import { UserPermissionsEventData } from "@Shared/Communications/Responses/User/Permissions/UserPermissionsEventData";
import UserPermissionsEvent from "@Client/Communications/User/Permissions/UserPermissionsEvent";
import { FlyingFurnitureIconData } from "../UserInterface/components/Inventory/FlyingFurniture/FlyingFurnitureIcon";
import RoomChatEvent from "@Client/Communications/Room/Chat/RoomChatEvent";
import UserTypingEvent from "@Client/Communications/Room/User/UserTypingEvent";
import { UserTypingEventData } from "@Shared/Communications/Responses/Rooms/Users/UserTypingEventData";
import RoomBotEvent from "@Client/Communications/Room/Bots/RoomBotEvent";
import { RoomBotEventData } from "@Shared/Communications/Responses/Rooms/Bots/RoomBotEventData";
import { RoomChatEventData } from "@Shared/Communications/Responses/Rooms/Chat/RoomChatEventData";
import { UserIdlingEventData } from "@Shared/Communications/Responses/Rooms/Users/UserIdlingEventData";
import UserIdlingEvent from "@Client/Communications/Room/User/UserIdlingEvent";
import RoomActorPositionEvent from "@Client/Communications/Room/Actors/RoomActorPositionEvent";
import { LocalSettings } from "../UserInterface/components/Settings/Interfaces/LocalSettings";
import { RoomActorActionData, RoomActorPositionData, RoomActorWalkToData, UserData } from "@pixel63/events";
import RoomActorWalkToEvent from "@Client/Communications/Room/Actors/RoomActorWalkToEvent";
import RoomActorActionEvent from "@Client/Communications/Room/Actors/RoomActorActionEvent";

export default class ClientInstance extends EventTarget {
    public roomInstance = new ObservableProperty<RoomInstance>();
    public roomChatStyles = new ObservableProperty<RoomChatStyleData[]>();
    public dialogs = new ObservableProperty<Dialog[]>([]);
    public user = new ObservableProperty<UserData>();
    public roomHistory = new ObservableProperty<RoomHistory[]>([]);
    public hotel = new ObservableProperty<HotelEventData>();
    public navigator = new ObservableProperty<NavigatorRoomsEventData>([]);
    public permissions = new ObservableProperty<PermissionAction[]>([]);

    public flyingFurnitureIcons = new ObservableProperty<FlyingFurnitureIconData[]>([]);
    
    public roomCategories = new ObservableProperty<RoomCategoriesEventData>([]);

    public settings = new ObservableProperty<LocalSettings>({});

    constructor(public readonly element: HTMLElement) {
        super();

        //element.style.background = "#9ED5EC";

        const settings = localStorage.getItem("settings");

        if(settings) {
            this.settings.value = JSON.parse(settings);
        }

        this.settings.subscribe((value) => localStorage.setItem("settings", JSON.stringify(value)));

        registerRoomEvents(this);

        // User events
        webSocketClient.addProtobuffListener(UserData, new UserEvent());

        // Room actor events
        webSocketClient.addProtobuffListener(RoomActorWalkToData, new RoomActorWalkToEvent());
        webSocketClient.addProtobuffListener(RoomActorPositionData, new RoomActorPositionEvent());
        webSocketClient.addProtobuffListener(RoomActorActionData, new RoomActorActionEvent());

        webSocketClient.addEventListener<WebSocketEvent<NavigatorRoomsEventData>>("NavigatorRoomsEvent", (event) => new NavigatorRoomsEvent().handle(event));
        webSocketClient.addEventListener<WebSocketEvent<HotelEventData>>("HotelEvent", (event) => new HotelEvent().handle(event));
        webSocketClient.addEventListener<WebSocketEvent<UserPermissionsEventData>>("UserPermissionsEvent", (event) => new UserPermissionsEvent().handle(event));
        
        webSocketClient.addEventListener<WebSocketEvent<RoomFurnitureEventData>>("RoomFurnitureEvent", (event) => new RoomFurnitureEvent().handle(event));
        webSocketClient.addEventListener<WebSocketEvent<RoomBotEventData>>("RoomBotEvent", (event) => new RoomBotEvent().handle(event));

        webSocketClient.addEventListener<WebSocketEvent<MoveRoomFurnitureEventData>>("MoveRoomFurnitureEvent", (event) => new MoveRoomFurnitureEvent().handle(event));
        webSocketClient.addEventListener<WebSocketEvent<RoomStructureEventData>>("RoomStructureEvent", (event) => new RoomStructureEvent().handle(event));
        webSocketClient.addEventListener<WebSocketEvent<RoomInformationEventData>>("RoomInformationEvent", (event) => new RoomInformationEvent().handle(event));
        webSocketClient.addEventListener<WebSocketEvent<RoomUserRightsEventData>>("RoomUserRightsEvent", (event) => new RoomUserRightsEvent().handle(event));
        webSocketClient.addEventListener<WebSocketEvent<UserFigureConfigurationEventData>>("UserFigureConfigurationEvent", (event) => new UserFigureConfigurationEvent().handle(event));

        webSocketClient.addEventListener<WebSocketEvent<RoomChatEventData>>("RoomChatEvent", (event) => new RoomChatEvent().handle(event));

        webSocketClient.addEventListener<WebSocketEvent<UserTypingEventData>>("UserTypingEvent", (event) => new UserTypingEvent().handle(event));
        webSocketClient.addEventListener<WebSocketEvent<UserIdlingEventData>>("UserIdlingEvent", (event) => new UserIdlingEvent().handle(event));

        webSocketClient.addEventListener<WebSocketEvent<RoomChatStylesEventData>>("RoomChatStylesEvent", (event) => {
            this.roomChatStyles.value = event.data.roomChatStyles;
        });
        
        webSocketClient.addEventListener<WebSocketEvent<RoomCategoriesEventData>>("RoomCategoriesEvent", (event) => {
            this.roomCategories.value = event.data;
        });
    }

    addEventListener<T>(type: string, callback: (event: T) => void | null, options?: AddEventListenerOptions | boolean): void {
        super.addEventListener(type, callback as EventListener, options);
    }

    removeEventListener<T>(type: string, callback: (event: T) => void | null, options?: EventListenerOptions | boolean): void {
        super.removeEventListener(type, callback as EventListener, options);
    }

    destroy() {
        this.roomInstance.value?.terminate();

        this.element.innerHTML = "";
    }
}
