import {
    CreateRoomData,
    DeleteHotelActivityRewardData,
    DeleteRoomMapData,
    DeleteShopFurnitureData,
    DeleteShopMembershipData,
    EnterRandomRoomData,
    EnterRoomBellQueueData,
    EnterRoomData,
    ExitRoomBellQueueData,
    GetAchievementsCategoriesData,
    GetAchievementsData,
    GetBadgeBrowserData,
    GetFurnitureBrowserData,
    GetFurnitureCrackableData,
    GetFurnitureTypesData,
    GetGroupData,
    GetGroupMembersData,
    GetHotelActivityRewardsData,
    GetHotelFeedbackData,
    GetHotelSettingsData,
    GetNavigatorData,
    GetPetBreedsData,
    GetPetBrowserData,
    GetRoomCategoriesData,
    GetRoomMapsData,
    GetShopFurnitureLinkData,
    GetShopGiftFurnitureData,
    GetShopPageBotsData,
    GetShopPageBundleFurnitureData,
    GetShopPageFurnitureData,
    GetShopPageLinkData,
    GetShopPageMembershipsData,
    GetShopPagePetsData,
    GetShopPagesData,
    GetUserBadgesData,
    GetUserClothesData,
    GetUserData,
    GetUserEffectsData,
    GetUserFiguresData,
    GetUserFriendRelationshipsData,
    GetUserFriendsData,
    GetUserGroupData,
    GetUserGroupsData,
    GetUserHabboClubData,
    GetUserInventoryBadgesData,
    GetUserInventoryBotsData,
    GetUserInventoryFurnitureData,
    GetUserInventoryPetsData,
    GetUserInventorySongDisksData,
    GetUserInventorySoundSetsData,
    GetUserProfileData,
    GetUserRoomsData,
    JoinGroupData,
    LeaveGroupData,
    LeaveRoomData,
    PingData,
    PurchaseRoomCameraPhotoData,
    PurchaseShopBotData,
    PurchaseShopBundleData,
    PurchaseShopFurnitureData,
    PurchaseShopMembershipData,
    PurchaseShopPetData,
    RemoveUserFriendData,
    RoomReadyData,
    SearchUserFriendsData,
    SendHotelFeedbackData,
    SendUserFriendMessageData,
    SendUserFriendRequestData,
    SetGroupFavouriteData,
    SetUserFigureConfigurationData,
    SetUserHomeRoomData,
    SetUserMottoData,
    SetUserRoomChatStyleData,
    UpdateBadgeData,
    UpdateClothingData,
    UpdateFurnitureCrackableData,
    UpdateFurnitureData,
    UpdateGroupData,
    UpdateGroupRequestData,
    UpdateHotelActivityRewardData,
    UpdateHotelSettingData,
    UpdatePetData,
    UpdateRoomBellQueueData,
    UpdateRoomMapData,
    UpdateShopBotData,
    UpdateShopFeatureData,
    UpdateShopFurnitureData,
    UpdateShopMembershipData,
    UpdateShopPageData,
    UpdateShopPetData,
    UpdateUserBadgeData,
    UpdateUserFriendRelationshipData,
    UpdateUserFriendRequestData,
    UserFigureData
} from "@pixel63/events";

import type User from "../Users/User.js";
import GetShopPagesEvent from "./Game/Shop/GetShopPagesEvent.js";
import GetShopPageFurnitureEvent from "./Game/Shop/GetShopPageFurnitureEvent.js";
import PurchaseShopFurnitureEvent from "./Game/Shop/PurchaseShopFurnitureEvent.js";
import EnterRoomEvent from "./Game/Rooms/EnterRoomEvent.js";
import GetUserEvent from "./Game/Users/GetUserEvent.js";
import GetUserFurnitureEvent from "./Game/Inventory/GetUserFurnitureEvent.js";
import CreateRoomEvent from "./Game/Navigator/CreateRoomEvent.js";
import GetNavigatorRoomsEvent from "./Game/Navigator/GetNavigatorRoomsEvent.js";
import SetRoomChatStyleEvent from "./Game/Users/SetRoomChatStyleEvent.js";
import SetFigureConfigurationEvent from "./Game/Users/SetFigureConfigurationEvent.js";
import SetHomeRoomEvent from "./Game/Users/SetHomeRoomEvent.js";
import GetHotelFeedbackEvent from "./Game/Hotel/GetHotelFeedbackEvent.js";
import SendHotelFeedbackEvent from "./Game/Hotel/SendHotelFeedbackEvent.js";
import PingEvent from "./Game/Users/PingEvent.js";
import GetRoomCategoriesEvent from "./Game/Navigator/GetRoomCategoriesEvent.js";
import GetInventoryBadgesEvent from "./Game/Inventory/GetInventoryBadgesEvent.js";
import UpdateUserBadgeEvent from "./Game/Inventory/UpdateUserBadgeEvent.js";
import GetUserBadgesEvent from "./Game/Users/Badges/GetUserBadgesEvent.js";
import SetMottoEvent from "./Game/Users/SetMottoEvent.js";
import UpdateShopPageEvent from "./Game/Shop/Development/UpdateShopPageEvent.js";
import UpdateShopFurnitureEvent from "./Game/Shop/Development/UpdateShopFurnitureEvent.js";
import GetRoomMapsEvent from "./Game/Navigator/GetRoomMapsEvent.js";
import GetFurnitureTypesEvent from "./Game/Furniture/GetFurnitureTypesEvent.js";
import UpdateFurnitureEvent from "./Game/Furniture/UpdateFurnitureEvent.js";
import GetShopPageBotsEvent from "./Game/Shop/GetShopPageBotsEvent.js";
import UpdateShopBotEvent from "./Game/Shop/Development/UpdateShopBotEvent.js";
import PurchaseShopBotEvent from "./Game/Shop/PurchaseShopBotEvent.js";
import GetUserBotsEvent from "./Game/Inventory/GetUserBotsEvent.js";
import GetShopPagePetsEvent from "./Game/Shop/GetShopPagePetsEvent.js";
import UpdateShopPetEvent from "./Game/Shop/Development/UpdateShopPetEvent.js";
import PurchaseShopPetEvent from "./Game/Shop/PurchaseShopPetEvent.js";
import GetUserInventoryPetsEvent from "./Game/Inventory/Pets/GetUserInventoryPetsEvent.js";
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
import EnterRoomBellQueueEvent from "./Game/Rooms/EnterRoomBellQueueEvent.js";
import LeaveRoomBellQueueEvent from "./Game/Rooms/LeaveRoomBellQueueEvent.js";
import UpdateRoomBellQueueEvent from "../../Room/Events/Rooms/User/UpdateRoomBellQueueEvent.js";
import GetUserProfileEvent from "./Game/Users/Profile/GetUserProfileEvent.js";
import DeleteShopFurnitureEvent from "./Game/Shop/Development/DeleteShopFurnitureEvent.js";
import GetFurnitureCrackableEvent from "./Game/Furniture/Crackable/GetFurnitureCrackableEvent.js";
import UpdateFurnitureCrackableEvent from "./Game/Furniture/Crackable/UpdateFurnitureCrackableEvent.js";
import GetAchievementsCategoriesEvent from "./Game/Achievements/GetAchievementsCategoriesEvent.js";
import GetAchievementsEvent from "./Game/Achievements/GetAchievementsEvent.js";
import UpdateShopFeatureEvent from "./Game/Shop/Development/UpdateShopFeatureEvent.js";
import GetShopFurnitureLinkEvent from "./Game/Shop/GetShopFurnitureLinkEvent.js";
import GetUserClothesEvent from "./Game/Users/Clothes/GetUserClothesEvent.js";
import UpdateClothingEvent from "./Game/Clothing/UpdateClothingEvent.js";
import GetUserFiguresEvent from "./Game/Users/Figures/GetUserFiguresEvent.js";
import UserFigureEvent from "./Game/Users/Figures/UserFigureEvent.js";
import GetUserEffectsEvent from "./Game/Users/Effects/GetUserEffectsEvent.js";
import GetUserInventorySongDisksEvent from "./Game/Inventory/GetUserInventorySongDisksEvent.js";
import GetUserInventorySoundSetsEvent from "./Game/Inventory/GetUserInventorySoundSetsEvent.js";
import PurchaseRoomCameraPhotoEvent from "./Game/Rooms/PurchaseRoomCameraPhotoEvent.js";
import GetShopPageLinkEvent from "./Game/Shop/GetShopPageLinkEvent.js";
import GetShopPageMembershipsEvent from "./Game/Shop/GetShopPageMembershipsEvent.js";
import UpdateShopMembershipEvent from "./Game/Shop/Development/UpdateShopMembershipEvent.js";
import DeleteShopMembershipEvent from "./Game/Shop/Development/DeleteShopMembershipEvent.js";
import PurchaseShopMembershipEvent from "./Game/Shop/PurchaseShopMembershipEvent.js";
import UpdateRoomMapEvent from "./Game/Rooms/Maps/UpdateRoomMapEvent.js";
import DeleteRoomMapEvent from "./Game/Rooms/Maps/DeleteRoomMapEvent.js";
import GetHotelSettingsEvent from "./Game/Hotel/Settings/GetHotelSettingsEvent.js";
import UpdateHotelSettingEvent from "./Game/Hotel/Settings/UpdateHotelSettingEvent.js";
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
import EnterRandomRoomEvent from "./Game/Rooms/EnterRandomRoomEvent.js";
import SetGroupFavouriteEvent from "./Game/Groups/SetGroupFavouriteEvent.js";
import GetShopGiftFurnitureEvent from "./Game/Shop/Gifts/GetShopGiftFurnitureData.js";
import GetHotelActivityRewardsEvent from "./Game/Hotel/ActivityRewards/GetHotelActivityRewardsEvent.js";
import UpdateHotelActivityRewardEvent from "./Game/Hotel/ActivityRewards/UpdateHotelActivityRewardEvent.js";
import DeleteHotelActivityRewardEvent from "./Game/Hotel/ActivityRewards/DeleteHotelActivityRewardEvent.js";
import GetUserHabboClubEvent from "./Game/Users/HabboClub/GetUserHabboClubEvent.js";
import EventHandler from "../../Communication/EventHandler.js";
import LeaveRoomEvent from "./Game/Rooms/LeaveRoomEvent.js";

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

        // Room maps
        this.addProtobuffListener(UpdateRoomMapData, new UpdateRoomMapEvent());
        this.addProtobuffListener(DeleteRoomMapData, new DeleteRoomMapEvent());

        // User room events
        this.addProtobuffListener(GetUserRoomsData, new GetUserRoomsEvent());

        this.addProtobuffListener(EnterRoomData, new EnterRoomEvent());
        this.addProtobuffListener(EnterRandomRoomData, new EnterRandomRoomEvent());
        this.addProtobuffListener(LeaveRoomData, new LeaveRoomEvent());
            
        this.addProtobuffListener(GetUserData, new GetUserEvent());
        this.addProtobuffListener(GetUserInventoryFurnitureData, new GetUserFurnitureEvent());
        this.addProtobuffListener(GetUserInventoryBotsData, new GetUserBotsEvent());
        this.addProtobuffListener(GetUserBadgesData, new GetUserBadgesEvent());
        this.addProtobuffListener(GetUserInventoryBadgesData, new GetInventoryBadgesEvent());
        this.addProtobuffListener(UpdateUserBadgeData, new UpdateUserBadgeEvent());
        this.addProtobuffListener(SetUserRoomChatStyleData, new SetRoomChatStyleEvent());
        this.addProtobuffListener(SetUserFigureConfigurationData, new SetFigureConfigurationEvent());
        this.addProtobuffListener(SetUserHomeRoomData, new SetHomeRoomEvent());;
            
        this.addProtobuffListener(GetRoomMapsData, new GetRoomMapsEvent());
        this.addProtobuffListener(GetNavigatorData, new GetNavigatorRoomsEvent());
        this.addProtobuffListener(GetRoomCategoriesData, new GetRoomCategoriesEvent());;
            
        this.addProtobuffListener(GetHotelFeedbackData, new GetHotelFeedbackEvent());;

        this.addProtobuffListener(UpdateShopPageData, new UpdateShopPageEvent());
        this.addProtobuffListener(UpdateShopFurnitureData, new UpdateShopFurnitureEvent());
        this.addProtobuffListener(UpdateShopMembershipData, new UpdateShopMembershipEvent());
        this.addProtobuffListener(UpdateShopBotData, new UpdateShopBotEvent());;

        this.addProtobuffListener(SetUserMottoData, new SetMottoEvent());;

        this.addProtobuffListener(GetFurnitureTypesData, new GetFurnitureTypesEvent());

        this.addProtobuffListener(PingData, new PingEvent());
    }
}
