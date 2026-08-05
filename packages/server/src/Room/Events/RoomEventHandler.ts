import EnterRoomEvent from "../../Game/Events/Game/Rooms/EnterRoomEvent.js";
import PlaceFurnitureEvent from "./Rooms/Furniture/PlaceFurnitureEvent.js";
import StartWalkingEvent from "./Rooms/User/StartWalkingEvent.js";
import LeaveRoomEvent from "./Rooms/LeaveRoomEvent.js";
import PickupRoomFurnitureEvent from "./Rooms/Furniture/PickupRoomFurnitureEvent.js";
import UseRoomFurnitureEvent from "./Rooms/Furniture/UseRoomFurnitureEvent.js";
import PlaceRoomContentFurnitureEvent from "./Rooms/Furniture/PlaceRoomContentFurnitureEvent.js";
import SendUserMessageEvent from "./Rooms/User/SendUserMessageEvent.js";
import GetRoomChatStylesEvent from "./Rooms/Chat/Styles/GetRoomChatStylesEvent.js";
import UpdateRoomFurnitureEvent from "./Rooms/Furniture/UpdateRoomFurnitureEvent.js";
import UpdateRoomStructureEvent from "./Rooms/UpdateRoomStructureEvent.js";
import UpdateRoomInformationEvent from "./Rooms/UpdateRoomInformationEvent.js";
import UpdateUserRightsEvent from "./Rooms/User/UpdateUserRightsEvent.js";
import GetUserBadgesEvent from "./Rooms/User/GetUserBadgesEvent.js";
import ImportRoomFurnitureEvent from "./Rooms/Furniture/Development/ImportRoomFurnitureEvent.js";
import SetTypingEvent from "./Rooms/User/SetTypingEvent.js";
import PlaceBotEvent from "./Rooms/Bots/PlaceBotEvent.js";
import PickupRoomBotEvent from "./Rooms/Bots/PickupRoomBotEvent.js";
import UpdateRoomBotEvent from "./Rooms/Bots/UpdateRoomBotEvent.js";
import GetRoomBotSpeechEvent from "./Rooms/Bots/GetRoomBotSpeechEvent.js";
import RoomReadyEvent from "./Rooms/RoomReadyEvent.js";
import RoomClickEvent from "./Rooms/RoomClickEvent.js";
import { BurnRoomFurnitureTraxSongData, ClearRoomRightsData, CreateRoomData, DeleteHotelActivityRewardData, DeleteRoomFurnitureTraxSongData, DeleteRoomMapData, DeleteShopFurnitureData, DeleteShopMembershipData, EnterRandomRoomData, EnterRoomBellQueueData, EnterRoomData, ExitRoomBellQueueData, GetAchievementsCategoriesData, GetAchievementsData, GetBadgeBrowserData, GetFurnitureBrowserData, GetFurnitureCrackableData, GetFurnitureTypesData, GetGroupData, GetGroupMembersData, GetHotelActivityRewardsData, GetHotelFeedbackData, GetHotelSettingsData, GetNavigatorData, GetPetBreedsData, GetPetBrowserData, GetRoomCategoriesData, GetRoomChatStylesData, GetRoomMapsData, GetRoomRightsData, GetRoomWiredLogsData, GetRoomWiredMonitorData, GetShopFurnitureLinkData, GetShopGiftFurnitureData, GetShopPageBotsData, GetShopPageBundleFurnitureData, GetShopPageFurnitureData, GetShopPageLinkData, GetShopPageMembershipsData, GetShopPagePetsData, GetShopPagesData, GetUserBadgesData, GetUserBotSpeechData, GetUserClothesData, GetUserData, GetUserEffectsData, GetUserFiguresData, GetUserFriendRelationshipsData, GetUserFriendsData, GetUserGroupData, GetUserGroupsData, GetUserHabboClubData, GetUserInventoryBadgesData, GetUserInventoryBotsData, GetUserInventoryFurnitureData, GetUserInventoryPetsData, GetUserInventorySongDisksData, GetUserInventorySoundSetsData, GetUserProfileData, GetUserRoomsData, HotelAlertData, InsertRoomFurnitureTraxSongData, JoinGroupData, LeaveGroupData, LeaveRoomData, MessageType, PickupAllRoomFurnitureData, PickupRoomBotData, PickupRoomFurnitureData, PickupRoomPetData, PingData, PlaceRoomBotData, PlaceRoomContentFurnitureData, PlaceRoomFurnitureData, PlaceRoomPetData, PurchaseRoomCameraPhotoData, PurchaseShopBotData, PurchaseShopBundleData, PurchaseShopFurnitureData, PurchaseShopMembershipData, PurchaseShopPetData, RemoveUserFriendData, RequestRoomUserTradingData, ResetRoomClickConfigurationData, RoomClickData, RoomDoubleClickData, RoomFurnitureImportData, RoomReadyData, ScratchRoomPetData, SearchUserFriendsData, SendHotelFeedbackData, SendRoomChatMessageData, SendRoomUserWalkData, SendUserFriendMessageData, SendUserFriendRequestData, SetGroupFavouriteData, SetRoomChatTypingData, SetRoomClickConfigurationData, SetRoomUserRightsData, SetUserFigureConfigurationData, SetUserHomeRoomData, SetUserMottoData, SetUserRoomChatStyleData, UpdateBadgeData, UpdateClothingData, UpdateFurnitureCrackableData, UpdateFurnitureData, UpdateGroupData, UpdateGroupRequestData, UpdateHotelActivityRewardData, UpdateHotelSettingData, UpdatePetData, UpdateRoomBellQueueData, UpdateRoomBotData, UpdateRoomFurnitureData, UpdateRoomFurnitureTraxPlaylistData, UpdateRoomFurnitureTraxSongData, UpdateRoomInformationData, UpdateRoomMapData, UpdateRoomStructureData, UpdateRoomUserTradingData, UpdateShopBotData, UpdateShopFeatureData, UpdateShopFurnitureData, UpdateShopMembershipData, UpdateShopPageData, UpdateShopPetData, UpdateUserBadgeData, UpdateUserFriendRelationshipData, UpdateUserFriendRequestData, UserFigureData, UseRoomFurnitureData } from "@pixel63/events";
import PlaceRoomPetEvent from "./Rooms/Pets/PlaceRoomPetEvent.js";
import PickupRoomPetEvent from "./Rooms/Pets/PickupRoomPetEvent.js";
import EnterRoomBellQueueEvent from "./Rooms/Lock/EnterRoomBellQueueEvent.js";
import LeaveRoomBellQueueEvent from "./Rooms/Lock/LeaveRoomBellQueueEvent.js";
import UpdateRoomBellQueueEvent from "./Rooms/Lock/UpdateRoomBellQueueEvent.js";
import RoomDoubleClickEvent from "./Rooms/RoomDoubleClickEvent.js";
import UpdateRoomFurnitureTraxSongEvent from "./Rooms/Furniture/Trax/UpdateRoomFurnitureTraxSongEvent.js";
import UpdateRoomFurnitureTraxPlaylistEvent from "./Rooms/Furniture/Trax/UpdateRoomFurnitureTraxPlaylistEvent.js";
import DeleteRoomFurnitureTraxSongEvent from "./Rooms/Furniture/Trax/DeleteRoomFurnitureTraxSongEvent.js";
import BurnRoomFurnitureTraxSongEvent from "./Rooms/Furniture/Trax/BurnRoomFurnitureTraxSongEvent.js";
import InsertRoomFurnitureTraxSongEvent from "./Rooms/Furniture/Trax/InsertRoomFurnitureTraxSongEvent.js";
import SetRoomClickConfigurationEvent from "./Rooms/Configuration/SetRoomClickConfigurationEvent.js";
import ResetRoomClickConfigurationEvent from "./Rooms/Configuration/ResetRoomClickConfigurationEvent.js";
import PickupAllRoomFurnitureEvent from "./Rooms/Furniture/PickupAllRoomFurnitureEvent.js";
import PurchaseRoomCameraPhotoEvent from "../../Game/Events/Game/Rooms/PurchaseRoomCameraPhotoEvent.js";
import UpdateRoomMapEvent from "./Rooms/Maps/UpdateRoomMapEvent.js";
import DeleteRoomMapEvent from "./Rooms/Maps/DeleteRoomMapEvent.js";
import RequestRoomUserTradingEvent from "./Rooms/User/Trading/RequestRoomUserTradingEvent.js";
import UpdateRoomUserTradingEvent from "./Rooms/User/Trading/UpdateRoomUserTradingEvent.js";
import GetRoomWiredMonitorEvent from "./Rooms/Wired/GetRoomWiredMonitorEvent.js";
import GetRoomWiredLogsEvent from "./Rooms/Wired/GetRoomWiredLogsEvent.js";
import GetRoomRightsEvent from "./Rooms/Rights/GetRoomRightsEvent.js";
import ClearRoomRightsEvent from "./Rooms/Rights/ClearRoomRightsEvent.js";
import EnterRandomRoomEvent from "../../Game/Events/Game/Rooms/EnterRandomRoomEvent.js";
import ScratchRoomPetEvent from "./Rooms/Pets/ScratchRoomPetEvent.js";
import EventHandler from "../../Communication/EventHandler.js";
import RoomUser from "../Rooms/Users/RoomUser.js";

export default class RoomEventHandler extends EventHandler<RoomUser> {
    constructor() {
        super();

        this.registerIncomingEvents();
    }

    registerIncomingEvents() {
        // Room camera events
        this.addProtobuffListener(PurchaseRoomCameraPhotoData, new PurchaseRoomCameraPhotoEvent());

        // Room bell events
        this.addProtobuffListener(EnterRoomBellQueueData, new EnterRoomBellQueueEvent());
        this.addProtobuffListener(ExitRoomBellQueueData, new LeaveRoomBellQueueEvent());
        this.addProtobuffListener(UpdateRoomBellQueueData, new UpdateRoomBellQueueEvent());

        // Room pet events
        this.addProtobuffListener(PlaceRoomPetData, new PlaceRoomPetEvent());
        this.addProtobuffListener(PickupRoomPetData, new PickupRoomPetEvent());
        this.addProtobuffListener(ScratchRoomPetData, new ScratchRoomPetEvent());

        // Room click configuration
        this.addProtobuffListener(SetRoomClickConfigurationData, new SetRoomClickConfigurationEvent());
        this.addProtobuffListener(ResetRoomClickConfigurationData, new ResetRoomClickConfigurationEvent());

        // Room furniture events
        this.addProtobuffListener(UpdateRoomFurnitureTraxSongData, new UpdateRoomFurnitureTraxSongEvent());
        this.addProtobuffListener(UpdateRoomFurnitureTraxPlaylistData, new UpdateRoomFurnitureTraxPlaylistEvent());
        this.addProtobuffListener(DeleteRoomFurnitureTraxSongData, new DeleteRoomFurnitureTraxSongEvent());
        this.addProtobuffListener(BurnRoomFurnitureTraxSongData, new BurnRoomFurnitureTraxSongEvent());
        this.addProtobuffListener(InsertRoomFurnitureTraxSongData, new InsertRoomFurnitureTraxSongEvent());

        // Room maps
        this.addProtobuffListener(UpdateRoomMapData, new UpdateRoomMapEvent());
        this.addProtobuffListener(DeleteRoomMapData, new DeleteRoomMapEvent());

        // Room user trading
        this.addProtobuffListener(RequestRoomUserTradingData, new RequestRoomUserTradingEvent());
        this.addProtobuffListener(UpdateRoomUserTradingData, new UpdateRoomUserTradingEvent());

        // Room wired events
        this.addProtobuffListener(GetRoomWiredMonitorData, new GetRoomWiredMonitorEvent());
        this.addProtobuffListener(GetRoomWiredLogsData, new GetRoomWiredLogsEvent());

        // Room rights events
        this.addProtobuffListener(GetRoomRightsData, new GetRoomRightsEvent());
        this.addProtobuffListener(ClearRoomRightsData, new ClearRoomRightsEvent());

        this.addProtobuffListener(RoomReadyData, new RoomReadyEvent());
        this.addProtobuffListener(RoomClickData, new RoomClickEvent());
        this.addProtobuffListener(RoomDoubleClickData, new RoomDoubleClickEvent());
            
        this
            .addProtobuffListener(EnterRoomData, new EnterRoomEvent())
            .addProtobuffListener(EnterRandomRoomData, new EnterRandomRoomEvent())
            .addProtobuffListener(LeaveRoomData, new LeaveRoomEvent())
            .addProtobuffListener(PlaceRoomFurnitureData, new PlaceFurnitureEvent())
            .addProtobuffListener(PlaceRoomBotData, new PlaceBotEvent())
            .addProtobuffListener(PlaceRoomContentFurnitureData, new PlaceRoomContentFurnitureEvent())
            .addProtobuffListener(UseRoomFurnitureData, new UseRoomFurnitureEvent())
            .addProtobuffListener(UpdateRoomFurnitureData, new UpdateRoomFurnitureEvent())
            .addProtobuffListener(UpdateRoomBotData, new UpdateRoomBotEvent())
            .addProtobuffListener(PickupRoomFurnitureData, new PickupRoomFurnitureEvent())
            .addProtobuffListener(PickupAllRoomFurnitureData, new PickupAllRoomFurnitureEvent())
            .addProtobuffListener(PickupRoomBotData, new PickupRoomBotEvent())
            .addProtobuffListener(SendRoomUserWalkData, new StartWalkingEvent())
            .addProtobuffListener(SendRoomChatMessageData, new SendUserMessageEvent())
            .addProtobuffListener(GetRoomChatStylesData, new GetRoomChatStylesEvent())
            .addProtobuffListener(UpdateRoomStructureData, new UpdateRoomStructureEvent())
            .addProtobuffListener(UpdateRoomInformationData, new UpdateRoomInformationEvent())
            .addProtobuffListener(SetRoomUserRightsData, new UpdateUserRightsEvent());
            
        this.addProtobuffListener(SetRoomChatTypingData, new SetTypingEvent());
            
        this.addProtobuffListener(GetUserBotSpeechData, new GetRoomBotSpeechEvent());

        this
            .addProtobuffListener(RoomFurnitureImportData, new ImportRoomFurnitureEvent());
    }
}
