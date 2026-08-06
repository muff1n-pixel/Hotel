import registerRoomEvents from "@Client/Room/Events/RoomEvents";
import RoomInstance from "./Room/RoomInstance";
import { webSocketClient } from "..";
import ObservableProperty from "@Client/Utilities/ObservableProperty";
import { Dialog } from "../UserInterface/Contexts/AppContext";
import UserEvent from "@Client/Communications/User/UserEvent";
import { RoomHistory } from "../UserInterface/Components/Room/Toolbar/ToolbarRoomChat";
import HotelEvent from "@Client/Communications/Hotel/HotelEvent";
import NavigatorEvent from "@Client/Communications/Navigator/NavigatorEvent";
import { PermissionAction } from "@pixel63/shared/Interfaces/Permissions/PermissionMap";
import UserPermissionsEvent from "@Client/Communications/User/Permissions/UserPermissionsEvent";
import { FlyingFurnitureIconData } from "../UserInterface/Components/Inventory/FlyingFurniture/FlyingFurnitureIcon";
import { LocalSettings } from "../UserInterface/Components/Settings/Interfaces/LocalSettings";
import { HotelData, NavigatorData, RoomActorActionData, RoomActorChatData, RoomActorPositionData, RoomActorWalkToData, RoomBotsData, RoomCategoriesData, RoomCategoryData, RoomChatStylesData, RoomFurnitureData, RoomFurnitureMovedData, RoomInformationData, RoomUserEnteredData, RoomUserData, UserData, RoomUserLeftData, RoomStructureData, UserPermissionsData, NavigatorCategoryData, LeaveRoomData, RoomPetsData, UserFriendData, UserFriendsData, UserFriendUpdateData, UserFriendMessageData, WidgetNotificationData, RoomLockData, RoomBellQueueData, HotelAlertData, UserClothingUnlockedData, RoomClickConfigurationData, RoomClickConfigurationResetData, RoomUserTradingData, RoomUserTradingClosedData, RoomGroupData, RoomEventData, UserNotificationData, UserHabboClubData, ConnectToRoomData } from "@pixel63/events";
import UserFriendsEvent from "@Client/Communications/User/Friends/UserFriendsEvent";
import UserFriendUpdateEvent from "@Client/Communications/User/Friends/UserFriendUpdateEvent";
import { MessengerTab } from "@UserInterface/Components/Messenger/Interfaces/MessengerTab";
import UserFriendMessageEvent from "@Client/Communications/User/Friends/UserFriendMessageEvent";
import WidgetNotificationEvent from "@Client/Communications/Widget/WidgetNotificationEvent";
import RoomBellQueueEvent from "@Client/Communications/Room/Lock/RoomBellQueueEvent";
import HotelAlertEvent from "@Client/Communications/Hotel/HotelAlertEvent";
import UserClothingUnlockedEvent from "@Client/Communications/User/Clothing/UserClothingUnlockedEvent";
import ObservableRequiredProperty from "@Client/Utilities/ObservableRequiredProperty";
import UserNotifications from "./User/UserNotifications";
import UserNotificationEvent from "./Communications/User/Notifications/UserNotificationEvent";
import UserHabboClubEvent from "./Communications/User/HabboClub/UserHabboClubEvent";
import ConnectToRoomEvent from "./Communications/Room/ConnectToRoomEvent";
import RoomLockEvent from "./Communications/Room/Lock/RoomLockEvent";
import RoomCategoriesEvent from "./Communications/Room/Categories/RoomCategoriesEvent";

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
        webSocketClient.addProtobuffListener(RoomCategoriesData, new RoomCategoriesEvent());
        
        // User events
        webSocketClient.addProtobuffListener(UserData, new UserEvent());
        webSocketClient.addProtobuffListener(UserHabboClubData, new UserHabboClubEvent());
        webSocketClient.addProtobuffListener(UserPermissionsData, new UserPermissionsEvent());

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

        // Room bell events
        webSocketClient.addProtobuffListener(RoomLockData, new RoomLockEvent());
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
