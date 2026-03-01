import registerRoomEvents from "@Client/Room/Events/RoomEvents";
import RoomInstance from "./Room/RoomInstance";
import RoomFurnitureEvent from "@Client/Communications/Room/Furniture/RoomFurnitureEvent";
import { webSocketClient } from "..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { RoomStructureEventData } from "@Shared/Communications/Responses/Rooms/RoomStructureEventData";
import RoomStructureEvent from "@Client/Communications/Room/RoomStructureEvent";
import ObservableProperty from "@Client/Utilities/ObservableProperty";
import { Dialog } from "../UserInterface/contexts/AppContext";
import RoomInformationEvent from "@Client/Communications/Room/RoomInformationEvent";
import UserEvent from "@Client/Communications/User/UserEvent";
import { RoomHistory } from "../UserInterface/components/Room/Toolbar/ToolbarRoomChat";
import HotelEvent from "@Client/Communications/Hotel/HotelEvent";
import NavigatorEvent from "@Client/Communications/Navigator/NavigatorEvent";
import RoomFurnitureMovedEvent from "@Client/Communications/Room/Furniture/MoveRoomFurnitureEvent";
import { PermissionAction } from "@Shared/Interfaces/Permissions/PermissionMap";
import { UserPermissionsEventData } from "@Shared/Communications/Responses/User/Permissions/UserPermissionsEventData";
import UserPermissionsEvent from "@Client/Communications/User/Permissions/UserPermissionsEvent";
import { FlyingFurnitureIconData } from "../UserInterface/components/Inventory/FlyingFurniture/FlyingFurnitureIcon";
import RoomActorChatEvent from "@Client/Communications/Room/Actors/RoomActorChatEvent";
import UserTypingEvent from "@Client/Communications/Room/User/UserTypingEvent";
import RoomBotsEvent from "@Client/Communications/Room/Bots/RoomBotsEvent";
import RoomActorPositionEvent from "@Client/Communications/Room/Actors/RoomActorPositionEvent";
import { LocalSettings } from "../UserInterface/components/Settings/Interfaces/LocalSettings";
import { HotelData, NavigatorData, RoomActorActionData, RoomActorChatData, RoomActorPositionData, RoomActorWalkToData, RoomBotsData, RoomCategoriesData, RoomCategoryData, RoomChatStylesData, RoomFurnitureData, RoomFurnitureMovedData, RoomInformationData, RoomUserEnteredData, RoomUserData, UserData } from "@pixel63/events";
import RoomActorWalkToEvent from "@Client/Communications/Room/Actors/RoomActorWalkToEvent";
import RoomActorActionEvent from "@Client/Communications/Room/Actors/RoomActorActionEvent";
import RoomCategoriesEvent from "@Client/Communications/Room/Categories/RoomCategoriesEvent";
import RoomChatStylesEvent from "@Client/Communications/Room/Chat/RoomChatStylesEvent";
import RoomUserEnteredEvent from "@Client/Communications/Room/User/RoomUserEnteredEvent";
import RoomUserEvent from "@Client/Communications/Room/User/RoomUserEvent";

export default class ClientInstance extends EventTarget {
    public roomInstance = new ObservableProperty<RoomInstance>();
    public roomChatStyles = new ObservableProperty<string[]>();
    public dialogs = new ObservableProperty<Dialog[]>([]);
    public user = new ObservableProperty<UserData>();
    public roomHistory = new ObservableProperty<RoomHistory[]>([]);
    public hotel = new ObservableProperty<HotelData>();
    public navigator = new ObservableProperty<NavigatorData>();
    public permissions = new ObservableProperty<PermissionAction[]>([]);

    public flyingFurnitureIcons = new ObservableProperty<FlyingFurnitureIconData[]>([]);
    
    public roomCategories = new ObservableProperty<RoomCategoryData[]>([]);

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

        // Room events
        webSocketClient.addProtobuffListener(RoomCategoriesData, new RoomCategoriesEvent());
        webSocketClient.addProtobuffListener(RoomChatStylesData, new RoomChatStylesEvent());
        webSocketClient.addProtobuffListener(RoomInformationData, new RoomInformationEvent());

        // Room actor events
        webSocketClient.addProtobuffListener(RoomActorWalkToData, new RoomActorWalkToEvent());
        webSocketClient.addProtobuffListener(RoomActorPositionData, new RoomActorPositionEvent());
        webSocketClient.addProtobuffListener(RoomActorActionData, new RoomActorActionEvent());
        webSocketClient.addProtobuffListener(RoomActorChatData, new RoomActorChatEvent());

        // Room bot events
        webSocketClient.addProtobuffListener(RoomBotsData, new RoomBotsEvent());

        // Room furniture events
        webSocketClient.addProtobuffListener(RoomFurnitureMovedData, new RoomFurnitureMovedEvent());
        webSocketClient.addProtobuffListener(RoomFurnitureData, new RoomFurnitureEvent());

        // Room user events
        webSocketClient.addProtobuffListener(RoomUserData, new RoomUserEvent());
        webSocketClient.addProtobuffListener(RoomUserEnteredData, new RoomUserEnteredEvent());

        // Hotel events
        webSocketClient.addProtobuffListener(HotelData, new HotelEvent());

        // Navigator events
        webSocketClient.addProtobuffListener(NavigatorData, new NavigatorEvent());
        
        webSocketClient.addEventListener<WebSocketEvent<UserPermissionsEventData>>("UserPermissionsEvent", (event) => new UserPermissionsEvent().handle(event));
        
        webSocketClient.addEventListener<WebSocketEvent<RoomStructureEventData>>("RoomStructureEvent", (event) => new RoomStructureEvent().handle(event));
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
