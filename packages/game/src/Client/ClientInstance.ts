import registerRoomEvents from "@Client/Room/Events/RoomEvents";
import RoomInstance from "./Room/RoomInstance";
import RoomFurnitureEvent from "@Client/Communications/Room/Furniture/RoomFurnitureEvent";
import { webSocketClient } from "..";
import RoomStructureEvent from "@Client/Communications/Room/RoomStructureEvent";
import ObservableProperty from "@Client/Utilities/ObservableProperty";
import { Dialog } from "../UserInterface/Contexts/AppContext";
import RoomInformationEvent from "@Client/Communications/Room/RoomInformationEvent";
import UserEvent from "@Client/Communications/User/UserEvent";
import { RoomHistory } from "../UserInterface/Components/Room/Toolbar/ToolbarRoomChat";
import HotelEvent from "@Client/Communications/Hotel/HotelEvent";
import NavigatorEvent from "@Client/Communications/Navigator/NavigatorEvent";
import RoomFurnitureMovedEvent from "@Client/Communications/Room/Furniture/MoveRoomFurnitureEvent";
import { PermissionAction } from "@pixel63/shared/Interfaces/Permissions/PermissionMap";
import UserPermissionsEvent from "@Client/Communications/User/Permissions/UserPermissionsEvent";
import { FlyingFurnitureIconData } from "../UserInterface/Components/Inventory/FlyingFurniture/FlyingFurnitureIcon";
import RoomActorChatEvent from "@Client/Communications/Room/Actors/RoomActorChatEvent";
import RoomBotsEvent from "@Client/Communications/Room/Bots/RoomBotsEvent";
import RoomActorPositionEvent from "@Client/Communications/Room/Actors/RoomActorPositionEvent";
import { LocalSettings } from "../UserInterface/Components/Settings/Interfaces/LocalSettings";
import { HotelData, NavigatorData, RoomActorActionData, RoomActorChatData, RoomActorPositionData, RoomActorWalkToData, RoomBotsData, RoomCategoriesData, RoomCategoryData, RoomChatStylesData, RoomFurnitureData, RoomFurnitureMovedData, RoomInformationData, RoomUserEnteredData, RoomUserData, UserData, RoomUserLeftData, RoomStructureData, UserPermissionsData, NavigatorCategoryData, LeaveRoomData, RoomPetsData, UserFriendData, UserFriendsData, UserFriendUpdateData, UserFriendMessageData, WidgetNotificationData, RoomLockData, RoomBellQueueData, HotelAlertData, UserClothingUnlockedData, RoomClickConfigurationData, RoomClickConfigurationResetData, RoomUserTradingData, RoomUserTradingClosedData, RoomGroupData, RoomEventData, UserNotificationData, UserHabboClubData, ConnectToRoomData } from "@pixel63/events";
import RoomActorWalkToEvent from "@Client/Communications/Room/Actors/RoomActorWalkToEvent";
import RoomActorActionEvent from "@Client/Communications/Room/Actors/RoomActorActionEvent";
import RoomCategoriesEvent from "@Client/Communications/Room/Categories/RoomCategoriesEvent";
import RoomChatStylesEvent from "@Client/Communications/Room/Chat/RoomChatStylesEvent";
import RoomUserEnteredEvent from "@Client/Communications/Room/User/RoomUserEnteredEvent";
import RoomUserEvent from "@Client/Communications/Room/User/RoomUserEvent";
import RoomUserLeftEvent from "@Client/Communications/Room/User/RoomUserLeftEvent";
import LeaveRoomEvent from "@Client/Communications/Room/LeaveRoomEvent";
import RoomPetsEvent from "@Client/Communications/Room/Pets/RoomPetsEvent";
import UserFriendsEvent from "@Client/Communications/User/Friends/UserFriendsEvent";
import UserFriendUpdateEvent from "@Client/Communications/User/Friends/UserFriendUpdateEvent";
import { MessengerTab } from "@UserInterface/Components/Messenger/Interfaces/MessengerTab";
import UserFriendMessageEvent from "@Client/Communications/User/Friends/UserFriendMessageEvent";
import WidgetNotificationEvent from "@Client/Communications/Widget/WidgetNotificationEvent";
import RoomLockEvent from "@Client/Communications/Room/Lock/RoomLockEvent";
import RoomBellQueueEvent from "@Client/Communications/Room/Lock/RoomBellQueueEvent";
import HotelAlertEvent from "@Client/Communications/Hotel/HotelAlertEvent";
import UserClothingUnlockedEvent from "@Client/Communications/User/Clothing/UserClothingUnlockedEvent";
import ObservableRequiredProperty from "@Client/Utilities/ObservableRequiredProperty";
import RoomClickConfigurationEvent from "@Client/Communications/Room/Configuration/RoomClickConfigurationEvent";
import RoomClickConfigurationResetEvent from "@Client/Communications/Room/Configuration/RoomClickConfigurationResetEvent";
import RoomUserTradingEvent from "@Client/Communications/Room/User/Trading/RoomUserTradingEvent";
import RoomUserTradingClosedEvent from "@Client/Communications/Room/User/Trading/RoomUserTradingClosedEvent";
import RoomGroupEvent from "@Client/Communications/Room/RoomGroupEvent";
import RoomEventEvent from "@Client/Communications/Room/RoomEventEvent";
import UserNotifications from "./User/UserNotifications";
import UserNotificationEvent from "./Communications/User/Notifications/UserNotificationEvent";
import UserHabboClubEvent from "./Communications/User/HabboClub/UserHabboClubEvent";
import WebSocketClient from "@Game/WebSocket/WebSocketClient";
import ConnectToRoomEvent from "./Communications/Room/ConnectToRoomEvent";

export default class ClientInstance extends EventTarget {
    public roomInstance = new ObservableProperty<RoomInstance>();
    public roomChatStyles = new ObservableProperty<string[]>();
    public dialogs = new ObservableRequiredProperty<Dialog[]>([]);
    public user = new ObservableProperty<UserData>();
    public userHabboClub = new ObservableProperty<UserHabboClubData>();
    public roomHistory = new ObservableProperty<RoomHistory[]>([]);
    public hotel = new ObservableProperty<HotelData>();
    public navigator = new ObservableProperty<NavigatorCategoryData[]>();
    public permissions = new ObservableProperty<PermissionAction[]>([]);

    public friends = new ObservableProperty<UserFriendData[]>();
    public incomingFriendRequests = new ObservableProperty<UserFriendData[]>();
    public outgoingFriendRequests = new ObservableProperty<UserFriendData[]>();

    public messenger = new ObservableProperty<MessengerTab[]>([]);
    public messengerUnread = new ObservableProperty<boolean>(false);

    public flyingFurnitureIcons = new ObservableProperty<FlyingFurnitureIconData[]>([]);
    public widgetNotifications = new ObservableProperty<WidgetNotificationData[]>([]);

    public roomCategories = new ObservableProperty<RoomCategoryData[]>([]);

    public roomUserTrading = new ObservableProperty<RoomUserTradingData>();

    public settings = new ObservableRequiredProperty<LocalSettings>(JSON.parse(localStorage.getItem("settings") ?? "{}"));

    public notifications = new UserNotifications();

    constructor(public readonly element: HTMLElement) {
        super();

        //element.style.background = "#9ED5EC";

        this.settings.subscribe((value) => localStorage.setItem("settings", JSON.stringify(value)));

        registerRoomEvents(this);

        // Room events
        webSocketClient.addProtobuffListener(ConnectToRoomData, new ConnectToRoomEvent());
        
        // User events
        webSocketClient.addProtobuffListener(UserData, new UserEvent());
        webSocketClient.addProtobuffListener(UserHabboClubData, new UserHabboClubEvent());
        webSocketClient.addProtobuffListener(UserPermissionsData, new UserPermissionsEvent());

        webSocketClient.addProtobuffListener(RoomBellQueueData, new RoomBellQueueEvent());

        // Hotel events
        webSocketClient.addProtobuffListener(HotelData, new HotelEvent());
        webSocketClient.addProtobuffListener(HotelAlertData, new HotelAlertEvent());

        // Navigator events
        webSocketClient.addProtobuffListener(NavigatorData, new NavigatorEvent());

        // User friends events
        webSocketClient.addProtobuffListener(UserFriendsData, new UserFriendsEvent());
        webSocketClient.addProtobuffListener(UserFriendUpdateData, new UserFriendUpdateEvent());

        // User friend messages events
        webSocketClient.addProtobuffListener(UserFriendMessageData, new UserFriendMessageEvent());

        // User clothing events
        webSocketClient.addProtobuffListener(UserClothingUnlockedData, new UserClothingUnlockedEvent());

        // User notification events
        webSocketClient.addProtobuffListener(UserNotificationData, new UserNotificationEvent());

        // Widgets
        webSocketClient.addProtobuffListener(WidgetNotificationData, new WidgetNotificationEvent());
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
