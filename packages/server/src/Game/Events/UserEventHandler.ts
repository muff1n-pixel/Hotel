import type User from "../Users/User.js";
import GetShopPagesEvent from "./Game/Shop/GetShopPagesEvent.js";
import GetShopPageFurnitureEvent from "./Game/Shop/GetShopPageFurnitureEvent.js";
import PurchaseShopFurnitureEvent from "./Game/Shop/PurchaseShopFurnitureEvent.js";
import EnterRoomEvent from "./Game/Rooms/EnterRoomEvent.js";
import GetUserEvent from "./Game/Users/GetUserEvent.js";
import GetUserFurnitureEvent from "./Game/Inventory/GetUserFurnitureEvent.js";
import PlaceFurnitureEvent from "../../Room/Events/Rooms/Furniture/PlaceFurnitureEvent.js";
import StartWalkingEvent from "../../Room/Events/Rooms/User/StartWalkingEvent.js";
import CreateRoomEvent from "./Game/Navigator/CreateRoomEvent.js";
import GetNavigatorRoomsEvent from "./Game/Navigator/GetNavigatorRoomsEvent.js";
import LeaveRoomEvent from "../../Room/Events/Rooms/LeaveRoomEvent.js";
import PickupRoomFurnitureEvent from "../../Room/Events/Rooms/Furniture/PickupRoomFurnitureEvent.js";
import UseRoomFurnitureEvent from "../../Room/Events/Rooms/Furniture/UseRoomFurnitureEvent.js";
import PlaceRoomContentFurnitureEvent from "../../Room/Events/Rooms/Furniture/PlaceRoomContentFurnitureEvent.js";
import SendUserMessageEvent from "../../Room/Events/Rooms/User/SendUserMessageEvent.js";
import GetRoomChatStylesEvent from "../../Room/Events/Rooms/Chat/Styles/GetRoomChatStylesEvent.js";
import SetRoomChatStyleEvent from "./Game/Users/SetRoomChatStyleEvent.js";
import SetFigureConfigurationEvent from "./Game/Users/SetFigureConfigurationEvent.js";
import UpdateRoomFurnitureEvent from "../../Room/Events/Rooms/Furniture/UpdateRoomFurnitureEvent.js";
import UpdateRoomStructureEvent from "../../Room/Events/Rooms/UpdateRoomStructureEvent.js";
import UpdateRoomInformationEvent from "../../Room/Events/Rooms/UpdateRoomInformationEvent.js";
import SetHomeRoomEvent from "./Game/Users/SetHomeRoomEvent.js";
import UpdateUserRightsEvent from "../../Room/Events/Rooms/User/UpdateUserRightsEvent.js";
import GetHotelFeedbackEvent from "./Game/Hotel/GetHotelFeedbackEvent.js";
import SendHotelFeedbackEvent from "./Game/Hotel/SendHotelFeedbackEvent.js";
import PingEvent from "./Game/Users/PingEvent.js";
import GetRoomCategoriesEvent from "./Game/Navigator/GetRoomCategoriesEvent.js";
import GetInventoryBadgesEvent from "./Game/Inventory/GetInventoryBadgesEvent.js";
import UpdateUserBadgeEvent from "./Game/Inventory/UpdateUserBadgeEvent.js";
import GetUserBadgesEvent from "../../Room/Events/Rooms/User/GetUserBadgesEvent.js";
import SetMottoEvent from "./Game/Users/SetMottoEvent.js";
import UpdateShopPageEvent from "./Game/Shop/Development/UpdateShopPageEvent.js";
import UpdateShopFurnitureEvent from "./Game/Shop/Development/UpdateShopFurnitureEvent.js";
import ImportRoomFurnitureEvent from "../../Room/Events/Rooms/Furniture/Development/ImportRoomFurnitureEvent.js";
import GetRoomMapsEvent from "./Game/Navigator/GetRoomMapsEvent.js";
import GetFurnitureTypesEvent from "./Game/Furniture/GetFurnitureTypesEvent.js";
import UpdateFurnitureEvent from "./Game/Furniture/UpdateFurnitureEvent.js";
import SetTypingEvent from "../../Room/Events/Rooms/User/SetTypingEvent.js";
import GetShopPageBotsEvent from "./Game/Shop/GetShopPageBotsEvent.js";
import UpdateShopBotEvent from "./Game/Shop/Development/UpdateShopBotEvent.js";
import PurchaseShopBotEvent from "./Game/Shop/PurchaseShopBotEvent.js";
import GetUserBotsEvent from "./Game/Inventory/GetUserBotsEvent.js";
import PlaceBotEvent from "../../Room/Events/Rooms/Bots/PlaceBotEvent.js";
import PickupRoomBotEvent from "../../Room/Events/Rooms/Bots/PickupRoomBotEvent.js";
import UpdateRoomBotEvent from "../../Room/Events/Rooms/Bots/UpdateRoomBotEvent.js";
import GetRoomBotSpeechEvent from "../../Room/Events/Rooms/Bots/GetRoomBotSpeechEvent.js";
import RoomReadyEvent from "../../Room/Events/Rooms/RoomReadyEvent.js";
import RoomClickEvent from "../../Room/Events/Rooms/RoomClickEvent.js";
import { BurnRoomFurnitureTraxSongData, ClearRoomRightsData, CreateRoomData, DeleteHotelActivityRewardData, DeleteRoomFurnitureTraxSongData, DeleteRoomMapData, DeleteShopFurnitureData, DeleteShopMembershipData, EnterRandomRoomData, EnterRoomBellQueueData, EnterRoomData, ExitRoomBellQueueData, GetAchievementsCategoriesData, GetAchievementsData, GetBadgeBrowserData, GetFurnitureBrowserData, GetFurnitureCrackableData, GetFurnitureTypesData, GetGroupData, GetGroupMembersData, GetHotelActivityRewardsData, GetHotelFeedbackData, GetHotelSettingsData, GetNavigatorData, GetPetBreedsData, GetPetBrowserData, GetRoomCategoriesData, GetRoomChatStylesData, GetRoomMapsData, GetRoomRightsData, GetRoomWiredLogsData, GetRoomWiredMonitorData, GetShopFurnitureLinkData, GetShopGiftFurnitureData, GetShopPageBotsData, GetShopPageBundleFurnitureData, GetShopPageFurnitureData, GetShopPageLinkData, GetShopPageMembershipsData, GetShopPagePetsData, GetShopPagesData, GetUserBadgesData, GetUserBotSpeechData, GetUserClothesData, GetUserData, GetUserEffectsData, GetUserFiguresData, GetUserFriendRelationshipsData, GetUserFriendsData, GetUserGroupData, GetUserGroupsData, GetUserHabboClubData, GetUserInventoryBadgesData, GetUserInventoryBotsData, GetUserInventoryFurnitureData, GetUserInventoryPetsData, GetUserInventorySongDisksData, GetUserInventorySoundSetsData, GetUserProfileData, GetUserRoomsData, HotelAlertData, InsertRoomFurnitureTraxSongData, JoinGroupData, LeaveGroupData, LeaveRoomData, MessageType, PickupAllRoomFurnitureData, PickupRoomBotData, PickupRoomFurnitureData, PickupRoomPetData, PingData, PlaceRoomBotData, PlaceRoomContentFurnitureData, PlaceRoomFurnitureData, PlaceRoomPetData, PurchaseRoomCameraPhotoData, PurchaseShopBotData, PurchaseShopBundleData, PurchaseShopFurnitureData, PurchaseShopMembershipData, PurchaseShopPetData, RemoveUserFriendData, RequestRoomUserTradingData, ResetRoomClickConfigurationData, RoomClickData, RoomDoubleClickData, RoomFurnitureImportData, RoomReadyData, ScratchRoomPetData, SearchUserFriendsData, SendHotelFeedbackData, SendRoomChatMessageData, SendRoomUserWalkData, SendUserFriendMessageData, SendUserFriendRequestData, SetGroupFavouriteData, SetRoomChatTypingData, SetRoomClickConfigurationData, SetRoomUserRightsData, SetUserFigureConfigurationData, SetUserHomeRoomData, SetUserMottoData, SetUserRoomChatStyleData, UpdateBadgeData, UpdateClothingData, UpdateFurnitureCrackableData, UpdateFurnitureData, UpdateGroupData, UpdateGroupRequestData, UpdateHotelActivityRewardData, UpdateHotelSettingData, UpdatePetData, UpdateRoomBellQueueData, UpdateRoomBotData, UpdateRoomFurnitureData, UpdateRoomFurnitureTraxPlaylistData, UpdateRoomFurnitureTraxSongData, UpdateRoomInformationData, UpdateRoomMapData, UpdateRoomStructureData, UpdateRoomUserTradingData, UpdateShopBotData, UpdateShopFeatureData, UpdateShopFurnitureData, UpdateShopMembershipData, UpdateShopPageData, UpdateShopPetData, UpdateUserBadgeData, UpdateUserFriendRelationshipData, UpdateUserFriendRequestData, UserFigureData, UseRoomFurnitureData } from "@pixel63/events";
import { UserProtobuffListener } from "./Interfaces/UserProtobuffListener.js";
import GetShopPagePetsEvent from "./Game/Shop/GetShopPagePetsEvent.js";
import UpdateShopPetEvent from "./Game/Shop/Development/UpdateShopPetEvent.js";
import PurchaseShopPetEvent from "./Game/Shop/PurchaseShopPetEvent.js";
import GetUserInventoryPetsEvent from "./Game/Inventory/Pets/GetUserInventoryPetsEvent.js";
import PlaceRoomPetEvent from "../../Room/Events/Rooms/Pets/PlaceRoomPetEvent.js";
import PickupRoomPetEvent from "../../Room/Events/Rooms/Pets/PickupRoomPetEvent.js";
import GetPetBrowserEvent from "./Game/Pets/GetPetBrowserEvent.js";
import GetPetBreedsEvent from "./Game/Pets/GetPetBreedsEvent.js";
import UpdatePetEvent from "./Game/Pets/UpdatePetEvent.js";
import GetUserFriendsEvent from "./Game/Users/Friends/GetUserFriendsEvent.js";
import SendUserFriendRequestEvent from "./Game/Users/Friends/SendUserFriendRequestEvent.js";
import UpdateUserFriendRequestEvent from "./Game/Users/Friends/UpdateUserFriendRequestEvent.js";
import SendUserFriendMessageEvent from "./Game/Users/Friends/SendUserFriendMessageEvent.js";
import RemoveUserFriendEvent from "./Game/Users/Friends/RemoveUserFriendEvent.js";
import SearchUserFriendsEvent from "./Game/Users/Friends/SearchUserFriendsEvent.js";
import PurchaseShopBundleEvent from "./Game/Shop/Bundles/PurchaseShopBundleEvent.js";
import GetShopPageBundleFurnitureEvent from "./Game/Shop/Bundles/GetShopPageBundleFurnitureEvent.js";
import GetFurnitureBrowserEvent from "./Game/Furniture/GetFurnitureBrowserEvent.js";
import GetBadgeBrowserEvent from "./Game/Badges/GetBadgeBrowserEvent.js";
import UpdateBadgeEvent from "./Game/Badges/UpdateBadgeEvent.js";
import EnterRoomBellQueueEvent from "../../Room/Events/Rooms/Lock/EnterRoomBellQueueEvent.js";
import LeaveRoomBellQueueEvent from "../../Room/Events/Rooms/Lock/LeaveRoomBellQueueEvent.js";
import UpdateRoomBellQueueEvent from "../../Room/Events/Rooms/Lock/UpdateRoomBellQueueEvent.js";
import GetUserProfileEvent from "./Game/Users/Profile/GetUserProfileEvent.js";
import DeleteShopFurnitureEvent from "./Game/Shop/Development/DeleteShopFurnitureEvent.js";
import GetFurnitureCrackableEvent from "./Game/Furniture/Crackable/GetFurnitureCrackableEvent.js";
import UpdateFurnitureCrackableEvent from "./Game/Furniture/Crackable/UpdateFurnitureCrackableEvent.js";
import RoomDoubleClickEvent from "../../Room/Events/Rooms/RoomDoubleClickEvent.js";
import GetAchievementsCategoriesEvent from "./Game/Achievements/GetAchievementsCategoriesEvent.js";
import GetAchievementsEvent from "./Game/Achievements/GetAchievementsEvent.js";
import UpdateShopFeatureEvent from "./Game/Shop/Development/UpdateShopFeatureEvent.js";
import GetShopFurnitureLinkEvent from "./Game/Shop/GetShopFurnitureLinkEvent.js";
import { randomUUID } from "node:crypto";
import GetUserClothesEvent from "./Game/Users/Clothes/GetUserClothesEvent.js";
import UpdateClothingEvent from "./Game/Clothing/UpdateClothingEvent.js";
import GetUserFiguresEvent from "./Game/Users/Figures/GetUserFiguresEvent.js";
import UserFigureEvent from "./Game/Users/Figures/UserFigureEvent.js";
import GetUserEffectsEvent from "./Game/Users/Effects/GetUserEffectsEvent.js";
import UpdateRoomFurnitureTraxSongEvent from "../../Room/Events/Rooms/Furniture/Trax/UpdateRoomFurnitureTraxSongEvent.js";
import UpdateRoomFurnitureTraxPlaylistEvent from "../../Room/Events/Rooms/Furniture/Trax/UpdateRoomFurnitureTraxPlaylistEvent.js";
import DeleteRoomFurnitureTraxSongEvent from "../../Room/Events/Rooms/Furniture/Trax/DeleteRoomFurnitureTraxSongEvent.js";
import BurnRoomFurnitureTraxSongEvent from "../../Room/Events/Rooms/Furniture/Trax/BurnRoomFurnitureTraxSongEvent.js";
import GetUserInventorySongDisksEvent from "./Game/Inventory/GetUserInventorySongDisksEvent.js";
import InsertRoomFurnitureTraxSongEvent from "../../Room/Events/Rooms/Furniture/Trax/InsertRoomFurnitureTraxSongEvent.js";
import GetUserInventorySoundSetsEvent from "./Game/Inventory/GetUserInventorySoundSetsEvent.js";
import SetRoomClickConfigurationEvent from "../../Room/Events/Rooms/Configuration/SetRoomClickConfigurationEvent.js";
import ResetRoomClickConfigurationEvent from "../../Room/Events/Rooms/Configuration/ResetRoomClickConfigurationEvent.js";
import PickupAllRoomFurnitureEvent from "../../Room/Events/Rooms/Furniture/PickupAllRoomFurnitureEvent.js";
import PurchaseRoomCameraPhotoEvent from "./Game/Rooms/PurchaseRoomCameraPhotoEvent.js";
import GetShopPageLinkEvent from "./Game/Shop/GetShopPageLinkEvent.js";
import GetShopPageMembershipsEvent from "./Game/Shop/GetShopPageMembershipsEvent.js";
import UpdateShopMembershipEvent from "./Game/Shop/Development/UpdateShopMembershipEvent.js";
import DeleteShopMembershipEvent from "./Game/Shop/Development/DeleteShopMembershipEvent.js";
import PurchaseShopMembershipEvent from "./Game/Shop/PurchaseShopMembershipEvent.js";
import UpdateRoomMapEvent from "../../Room/Events/Rooms/Maps/UpdateRoomMapEvent.js";
import DeleteRoomMapEvent from "../../Room/Events/Rooms/Maps/DeleteRoomMapEvent.js";
import RequestRoomUserTradingEvent from "../../Room/Events/Rooms/User/Trading/RequestRoomUserTradingEvent.js";
import UpdateRoomUserTradingEvent from "../../Room/Events/Rooms/User/Trading/UpdateRoomUserTradingEvent.js";
import GetHotelSettingsEvent from "./Game/Hotel/Settings/GetHotelSettingsEvent.js";
import UpdateHotelSettingEvent from "./Game/Hotel/Settings/UpdateHotelSettingEvent.js";
import GetRoomWiredMonitorEvent from "../../Room/Events/Rooms/Wired/GetRoomWiredMonitorEvent.js";
import GetRoomWiredLogsEvent from "../../Room/Events/Rooms/Wired/GetRoomWiredLogsEvent.js";
import UpdateUserFriendRelationshipEvent from "./Game/Users/Friends/UpdateUserFriendRelationshipEvent.js";
import GetUserFriendRelationshipsEvent from "./Game/Users/Friends/GetUserFriendRelationshipsEvent.js";
import GetUserRoomsEvent from "./Game/Users/Rooms/GetUserRoomsEvent.js";
import GetGroupEvent from "./Game/Groups/GetGroupEvent.js";
import GetUserGroupEvent from "./Game/Groups/GetUserGroupEvent.js";
import GetGroupMembersEvent from "./Game/Groups/GetGroupMembersEvent.js";
import UpdateGroupEvent from "./Game/Groups/UpdateGroupEvent.js";
import JoinGroupEvent from "./Game/Groups/JoinGroupEvent.js";
import LeaveGroupEvent from "./Game/Groups/LeaveGroupEvent.js";
import UpdateGroupRequestEvent from "./Game/Groups/UpdateGroupRequestEvent.js";
import GetUserGroupsEvent from "./Game/Groups/GetUserGroupsEvent.js";
import GetRoomRightsEvent from "../../Room/Events/Rooms/Rights/GetRoomRightsEvent.js";
import ClearRoomRightsEvent from "../../Room/Events/Rooms/Rights/ClearRoomRightsEvent.js";
import EnterRandomRoomEvent from "./Game/Rooms/EnterRandomRoomEvent.js";
import SetGroupFavouriteEvent from "./Game/Groups/SetGroupFavouriteEvent.js";
import GetShopGiftFurnitureEvent from "./Game/Shop/Gifts/GetShopGiftFurnitureData.js";
import GetHotelActivityRewardsEvent from "./Game/Hotel/ActivityRewards/GetHotelActivityRewardsEvent.js";
import UpdateHotelActivityRewardEvent from "./Game/Hotel/ActivityRewards/UpdateHotelActivityRewardEvent.js";
import DeleteHotelActivityRewardEvent from "./Game/Hotel/ActivityRewards/DeleteHotelActivityRewardEvent.js";
import GetUserHabboClubEvent from "./Game/Users/HabboClub/GetUserHabboClubEvent.js";
import ScratchRoomPetEvent from "../../Room/Events/Rooms/Pets/ScratchRoomPetEvent.js";
import EventHandler from "../../Communication/EventHandler.js";

export default class UserEventHandler extends EventHandler<User> {
    constructor() {
        super();

        this.registerIncomingEvents();
    }

    registerIncomingEvents() {
        // Achievement events
        this.addProtobuffListener(GetAchievementsCategoriesData, new GetAchievementsCategoriesEvent());
        this.addProtobuffListener(GetAchievementsData, new GetAchievementsEvent());

        // Hotel events
        this.addProtobuffListener(SendHotelFeedbackData, new SendHotelFeedbackEvent());

        // Hotel activity rewards events
        this.addProtobuffListener(GetHotelActivityRewardsData, new GetHotelActivityRewardsEvent());
        this.addProtobuffListener(UpdateHotelActivityRewardData, new UpdateHotelActivityRewardEvent());
        this.addProtobuffListener(DeleteHotelActivityRewardData, new DeleteHotelActivityRewardEvent());

        // Hotel settings
        this.addProtobuffListener(GetHotelSettingsData, new GetHotelSettingsEvent());
        this.addProtobuffListener(UpdateHotelSettingData, new UpdateHotelSettingEvent());

        // Badge events
        this.addProtobuffListener(UpdateBadgeData, new UpdateBadgeEvent());
        this.addProtobuffListener(GetBadgeBrowserData, new GetBadgeBrowserEvent());

        // Furniture events
        this.addProtobuffListener(UpdateFurnitureData, new UpdateFurnitureEvent());
        this.addProtobuffListener(GetFurnitureBrowserData, new GetFurnitureBrowserEvent());

        // Group events
        this.addProtobuffListener(JoinGroupData, new JoinGroupEvent());
        this.addProtobuffListener(LeaveGroupData, new LeaveGroupEvent());
        this.addProtobuffListener(UpdateGroupData, new UpdateGroupEvent());
        this.addProtobuffListener(GetGroupData, new GetGroupEvent());
        this.addProtobuffListener(GetGroupMembersData, new GetGroupMembersEvent());
        this.addProtobuffListener(SetGroupFavouriteData, new SetGroupFavouriteEvent());
        this.addProtobuffListener(UpdateGroupRequestData, new UpdateGroupRequestEvent());
        
        this.addProtobuffListener(GetUserGroupData, new GetUserGroupEvent());
        this.addProtobuffListener(GetUserGroupsData, new GetUserGroupsEvent());

        // Room events
        this.addProtobuffListener(CreateRoomData, new CreateRoomEvent());

        // Room camera events
        this.addProtobuffListener(PurchaseRoomCameraPhotoData, new PurchaseRoomCameraPhotoEvent());

        // Room bell events
        this.addProtobuffListener(EnterRoomBellQueueData, new EnterRoomBellQueueEvent());
        this.addProtobuffListener(ExitRoomBellQueueData, new LeaveRoomBellQueueEvent());
        this.addProtobuffListener(UpdateRoomBellQueueData, new UpdateRoomBellQueueEvent());

        // Shop events
        this.addProtobuffListener(GetShopPagesData, new GetShopPagesEvent());
        this.addProtobuffListener(GetShopPageFurnitureData, new GetShopPageFurnitureEvent());
        this.addProtobuffListener(GetShopPageBotsData, new GetShopPageBotsEvent());
        this.addProtobuffListener(GetShopPageMembershipsData, new GetShopPageMembershipsEvent());
        this.addProtobuffListener(PurchaseShopFurnitureData, new PurchaseShopFurnitureEvent());
        this.addProtobuffListener(PurchaseShopBotData, new PurchaseShopBotEvent());

        // Shop membership events
        this.addProtobuffListener(DeleteShopMembershipData, new DeleteShopMembershipEvent());
        this.addProtobuffListener(PurchaseShopMembershipData, new PurchaseShopMembershipEvent());

        // Shop furniture events
        this.addProtobuffListener(DeleteShopFurnitureData, new DeleteShopFurnitureEvent());
        this.addProtobuffListener(GetShopFurnitureLinkData, new GetShopFurnitureLinkEvent());
        this.addProtobuffListener(GetShopPageLinkData, new GetShopPageLinkEvent());

        // Shop feature events
        this.addProtobuffListener(UpdateShopFeatureData, new UpdateShopFeatureEvent());

        // Furniture crackable events
        this.addProtobuffListener(GetFurnitureCrackableData, new GetFurnitureCrackableEvent());
        this.addProtobuffListener(UpdateFurnitureCrackableData, new UpdateFurnitureCrackableEvent());

        // Shop pet events
        this.addProtobuffListener(GetShopPagePetsData, new GetShopPagePetsEvent());
        this.addProtobuffListener(UpdateShopPetData, new UpdateShopPetEvent());
        this.addProtobuffListener(PurchaseShopPetData, new PurchaseShopPetEvent());

        // Shop bundle events
        this.addProtobuffListener(PurchaseShopBundleData, new PurchaseShopBundleEvent());
        this.addProtobuffListener(GetShopPageBundleFurnitureData, new GetShopPageBundleFurnitureEvent());

        // Shop gift events
        this.addProtobuffListener(GetShopGiftFurnitureData, new GetShopGiftFurnitureEvent());

        // User inventory furniture
        this.addProtobuffListener(GetUserInventorySongDisksData, new GetUserInventorySongDisksEvent());
        this.addProtobuffListener(GetUserInventorySoundSetsData, new GetUserInventorySoundSetsEvent());

        // User inventory pets
        this.addProtobuffListener(GetUserInventoryPetsData, new GetUserInventoryPetsEvent());

        // User profile events
        this.addProtobuffListener(GetUserProfileData, new GetUserProfileEvent());
        this.addProtobuffListener(GetUserFriendRelationshipsData, new GetUserFriendRelationshipsEvent());

        // User habbo club events
        this.addProtobuffListener(GetUserHabboClubData, new GetUserHabboClubEvent());

        // Room pet events
        this.addProtobuffListener(PlaceRoomPetData, new PlaceRoomPetEvent());
        this.addProtobuffListener(PickupRoomPetData, new PickupRoomPetEvent());
        this.addProtobuffListener(ScratchRoomPetData, new ScratchRoomPetEvent());

        // Pet events
        this.addProtobuffListener(GetPetBrowserData, new GetPetBrowserEvent());
        this.addProtobuffListener(GetPetBreedsData, new GetPetBreedsEvent());
        this.addProtobuffListener(UpdatePetData, new UpdatePetEvent());

        // User friends events
        this.addProtobuffListener(GetUserFriendsData, new GetUserFriendsEvent());
        this.addProtobuffListener(SendUserFriendRequestData, new SendUserFriendRequestEvent());
        this.addProtobuffListener(UpdateUserFriendRequestData, new UpdateUserFriendRequestEvent());
        this.addProtobuffListener(UpdateUserFriendRelationshipData, new UpdateUserFriendRelationshipEvent());
        this.addProtobuffListener(RemoveUserFriendData, new RemoveUserFriendEvent());
        this.addProtobuffListener(SearchUserFriendsData, new SearchUserFriendsEvent());

        // User friend messages events
        this.addProtobuffListener(SendUserFriendMessageData, new SendUserFriendMessageEvent());

        // User clothes events
        this.addProtobuffListener(GetUserClothesData, new GetUserClothesEvent());
        this.addProtobuffListener(UpdateClothingData, new UpdateClothingEvent());

        // User effects events
        this.addProtobuffListener(GetUserEffectsData, new GetUserEffectsEvent());

        // User figures events
        this.addProtobuffListener(GetUserFiguresData, new GetUserFiguresEvent());
        this.addProtobuffListener(UserFigureData, new UserFigureEvent());

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

        // User room events
        this.addProtobuffListener(GetUserRoomsData, new GetUserRoomsEvent());

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
            
        this
            .addProtobuffListener(GetUserData, new GetUserEvent())
            .addProtobuffListener(GetUserInventoryFurnitureData, new GetUserFurnitureEvent())
            .addProtobuffListener(GetUserInventoryBotsData, new GetUserBotsEvent())
            .addProtobuffListener(GetUserBadgesData, new GetUserBadgesEvent())
            .addProtobuffListener(GetUserInventoryBadgesData, new GetInventoryBadgesEvent())
            .addProtobuffListener(UpdateUserBadgeData, new UpdateUserBadgeEvent())
            .addProtobuffListener(SetUserRoomChatStyleData, new SetRoomChatStyleEvent())
            .addProtobuffListener(SetUserFigureConfigurationData, new SetFigureConfigurationEvent())
            .addProtobuffListener(SetUserHomeRoomData, new SetHomeRoomEvent())
            .addProtobuffListener(SetRoomChatTypingData, new SetTypingEvent());
            
        this
            .addProtobuffListener(GetRoomMapsData, new GetRoomMapsEvent())
            .addProtobuffListener(GetNavigatorData, new GetNavigatorRoomsEvent())
            .addProtobuffListener(GetRoomCategoriesData, new GetRoomCategoriesEvent());
            
        this
            .addProtobuffListener(GetHotelFeedbackData, new GetHotelFeedbackEvent());

        this
            .addProtobuffListener(UpdateShopPageData, new UpdateShopPageEvent())
            .addProtobuffListener(UpdateShopFurnitureData, new UpdateShopFurnitureEvent())
            .addProtobuffListener(UpdateShopMembershipData, new UpdateShopMembershipEvent())
            .addProtobuffListener(UpdateShopBotData, new UpdateShopBotEvent());

        this.addProtobuffListener(GetUserBotSpeechData, new GetRoomBotSpeechEvent());

        this
            .addProtobuffListener(SetUserMottoData, new SetMottoEvent());

        this
            .addProtobuffListener(RoomFurnitureImportData, new ImportRoomFurnitureEvent());

        this.addProtobuffListener(GetFurnitureTypesData, new GetFurnitureTypesEvent());

        this.addProtobuffListener(PingData, new PingEvent());
    }
}
