import { EventEmitter } from "node:events";
import type User from "../Users/User.js";
import type { RawData } from "ws";
import IncomingEvent from "../Communication/Interfaces/IncomingEvent.js";
import GetShopPagesEvent from "../Communication/Game/Shop/GetShopPagesEvent.js";
import GetShopPageFurnitureEvent from "../Communication/Game/Shop/GetShopPageFurnitureEvent.js";
import PurchaseShopFurnitureEvent from "../Communication/Game/Shop/PurchaseShopFurnitureEvent.js";
import EnterRoomEvent from "../Communication/Game/Rooms/EnterRoomEvent.js";
import GetUserEvent from "../Communication/Game/Users/GetUserEvent.js";
import GetUserFurnitureEvent from "../Communication/Game/Inventory/GetUserFurnitureEvent.js";
import PlaceFurnitureEvent from "../Communication/Game/Rooms/Furniture/PlaceFurnitureEvent.js";
import StartWalkingEvent from "../Communication/Game/Rooms/User/StartWalkingEvent.js";
import CreateRoomEvent from "../Communication/Game/Navigator/CreateRoomEvent.js";
import GetNavigatorRoomsEvent from "../Communication/Game/Navigator/GetNavigatorRoomsEvent.js";
import LeaveRoomEvent from "../Communication/Game/Rooms/LeaveRoomEvent.js";
import PickupRoomFurnitureEvent from "../Communication/Game/Rooms/Furniture/PickupRoomFurnitureEvent.js";
import UseRoomFurnitureEvent from "../Communication/Game/Rooms/Furniture/UseRoomFurnitureEvent.js";
import PlaceRoomContentFurnitureEvent from "../Communication/Game/Rooms/Furniture/PlaceRoomContentFurnitureEvent.js";
import SendUserMessageEvent from "../Communication/Game/Rooms/User/SendUserMessageEvent.js";
import GetRoomChatStylesEvent from "../Communication/Game/Rooms/Chat/Styles/GetRoomChatStylesEvent.js";
import SetRoomChatStyleEvent from "../Communication/Game/Users/SetRoomChatStyleEvent.js";
import SetFigureConfigurationEvent from "../Communication/Game/Users/SetFigureConfigurationEvent.js";
import UpdateRoomFurnitureEvent from "../Communication/Game/Rooms/Furniture/UpdateRoomFurnitureEvent.js";
import UpdateRoomStructureEvent from "../Communication/Game/Rooms/UpdateRoomStructureEvent.js";
import UpdateRoomInformationEvent from "../Communication/Game/Rooms/UpdateRoomInformationEvent.js";
import SetHomeRoomEvent from "../Communication/Game/Users/SetHomeRoomEvent.js";
import UpdateUserRightsEvent from "../Communication/Game/Rooms/User/UpdateUserRightsEvent.js";
import GetHotelFeedbackEvent from "../Communication/Game/Hotel/GetHotelFeedbackEvent.js";
import SendHotelFeedbackEvent from "../Communication/Game/Hotel/SendHotelFeedbackEvent.js";
import PingEvent from "../Communication/Game/Users/PingEvent.js";
import GetRoomCategoriesEvent from "../Communication/Game/Navigator/GetRoomCategoriesEvent.js";
import GetInventoryBadgesEvent from "../Communication/Game/Inventory/GetInventoryBadgesEvent.js";
import UpdateUserBadgeEvent from "../Communication/Game/Inventory/UpdateUserBadgeEvent.js";
import GetUserBadgesEvent from "../Communication/Game/Rooms/User/GetUserProfileEvent.js";
import SetMottoEvent from "../Communication/Game/Users/SetMottoEvent.js";
import UpdateShopPageEvent from "../Communication/Game/Shop/Development/UpdateShopPageEvent.js";
import UpdateShopFurnitureEvent from "../Communication/Game/Shop/Development/UpdateShopFurnitureEvent.js";
import ImportRoomFurnitureEvent from "../Communication/Game/Rooms/Furniture/Development/ImportRoomFurnitureEvent.js";
import GetRoomMapsEvent from "../Communication/Game/Navigator/GetRoomMapsEvent.js";
import GetFurnitureTypesEvent from "../Communication/Game/Furniture/GetFurnitureTypesEvent.js";
import UpdateFurnitureEvent from "../Communication/Game/Furniture/UpdateFurnitureEvent.js";
import SetTypingEvent from "../Communication/Game/Rooms/User/SetTypingEvent.js";
import GetShopPageBotsEvent from "../Communication/Game/Shop/GetShopPageBotsEvent.js";
import UpdateShopBotEvent from "../Communication/Game/Shop/Development/UpdateShopBotEvent.js";
import PurchaseShopBotEvent from "../Communication/Game/Shop/PurchaseShopBotEvent.js";
import GetUserBotsEvent from "../Communication/Game/Inventory/GetUserBotsEvent.js";
import PlaceBotEvent from "../Communication/Game/Rooms/Bots/PlaceBotEvent.js";
import PickupRoomBotEvent from "../Communication/Game/Rooms/Bots/PickupRoomBotEvent.js";
import UpdateRoomBotEvent from "../Communication/Game/Rooms/Bots/UpdateRoomBotEvent.js";
import GetRoomBotSpeechEvent from "../Communication/Game/Rooms/Bots/GetRoomBotSpeechEvent.js";
import RoomReadyEvent from "../Communication/Game/Rooms/RoomReadyEvent.js";
import RoomClickEvent from "../Communication/Game/Rooms/RoomClickEvent.js";
import { BurnRoomFurnitureTraxSongData, CreateRoomData, DeleteRoomFurnitureTraxSongData, DeleteShopFurnitureData, EnterRoomBellQueueData, EnterRoomData, ExitRoomBellQueueData, GetAchievementsCategoriesData, GetAchievementsData, GetBadgeBrowserData, GetFurnitureBrowserData, GetFurnitureCrackableData, GetFurnitureTypesData, GetHotelFeedbackData, GetNavigatorData, GetPetBreedsData, GetPetBrowserData, GetRoomCategoriesData, GetRoomChatStylesData, GetRoomMapsData, GetShopFurnitureLinkData, GetShopPageBotsData, GetShopPageBundleFurnitureData, GetShopPageFurnitureData, GetShopPagePetsData, GetShopPagesData, GetUserBadgesData, GetUserBotSpeechData, GetUserClothesData, GetUserData, GetUserEffectsData, GetUserFiguresData, GetUserFriendsData, GetUserInventoryBadgesData, GetUserInventoryBotsData, GetUserInventoryFurnitureData, GetUserInventoryPetsData, GetUserInventorySongDisksData, GetUserInventorySoundSetsData, GetUserProfileData, HotelAlertData, InsertRoomFurnitureTraxSongData, LeaveRoomData, MessageType, PickupRoomBotData, PickupRoomFurnitureData, PickupRoomPetData, PingData, PlaceRoomBotData, PlaceRoomContentFurnitureData, PlaceRoomFurnitureData, PlaceRoomPetData, PurchaseShopBotData, PurchaseShopBundleData, PurchaseShopFurnitureData, PurchaseShopPetData, RemoveUserFriendData, RoomClickData, RoomDoubleClickData, RoomFurnitureImportData, RoomReadyData, SearchUserFriendsData, SendHotelFeedbackData, SendRoomChatMessageData, SendRoomUserWalkData, SendUserFriendMessageData, SendUserFriendRequestData, SetRoomChatTypingData, SetRoomUserRightsData, SetUserFigureConfigurationData, SetUserHomeRoomData, SetUserMottoData, SetUserRoomChatStyleData, UpdateBadgeData, UpdateClothingData, UpdateFurnitureCrackableData, UpdateFurnitureData, UpdatePetData, UpdateRoomBellQueueData, UpdateRoomBotData, UpdateRoomFurnitureData, UpdateRoomFurnitureTraxPlaylistData, UpdateRoomFurnitureTraxSongData, UpdateRoomInformationData, UpdateRoomStructureData, UpdateShopBotData, UpdateShopFeatureData, UpdateShopFurnitureData, UpdateShopPageData, UpdateShopPetData, UpdateUserBadgeData, UpdateUserFriendRequestData, UserFigureData, UseRoomFurnitureData } from "@pixel63/events";
import ProtobuffListener from "../Communication/Interfaces/ProtobuffListener.js";
import GetShopPagePetsEvent from "../Communication/Game/Shop/GetShopPagePetsEvent.js";
import UpdateShopPetEvent from "../Communication/Game/Shop/Development/UpdateShopPetEvent.js";
import PurchaseShopPetEvent from "../Communication/Game/Shop/PurchaseShopPetEvent.js";
import GetUserInventoryPetsEvent from "../Communication/Game/Inventory/Pets/GetUserInventoryPetsEvent.js";
import PlaceRoomPetEvent from "../Communication/Game/Rooms/Pets/PlaceRoomPetEvent.js";
import PickupRoomPetEvent from "../Communication/Game/Rooms/Pets/PickupRoomPetEvent.js";
import GetPetBrowserEvent from "../Communication/Game/Pets/GetPetBrowserEvent.js";
import GetPetBreedsEvent from "../Communication/Game/Pets/GetPetBreedsEvent.js";
import UpdatePetEvent from "../Communication/Game/Pets/UpdatePetEvent.js";
import GetUserFriendsEvent from "../Communication/Game/Users/Friends/GetUserFriendsEvent.js";
import SendUserFriendRequestEvent from "../Communication/Game/Users/Friends/SendUserFriendRequestEvent.js";
import UpdateUserFriendRequestEvent from "../Communication/Game/Users/Friends/UpdateUserFriendRequestEvent.js";
import SendUserFriendMessageEvent from "../Communication/Game/Users/Friends/SendUserFriendMessageEvent.js";
import RemoveUserFriendEvent from "../Communication/Game/Users/Friends/RemoveUserFriendEvent.js";
import SearchUserFriendsEvent from "../Communication/Game/Users/Friends/SearchUserFriendsEvent.js";
import PurchaseShopBundleEvent from "../Communication/Game/Shop/Bundles/PurchaseShopBundleEvent.js";
import GetShopPageBundleFurnitureEvent from "../Communication/Game/Shop/Bundles/GetShopPageBundleFurnitureEvent.js";
import GetFurnitureBrowserEvent from "../Communication/Game/Furniture/GetFurnitureBrowserEvent.js";
import GetBadgeBrowserEvent from "../Communication/Game/Badges/GetBadgeBrowserEvent.js";
import UpdateBadgeEvent from "../Communication/Game/Badges/UpdateBadgeEvent.js";
import EnterRoomBellQueueEvent from "../Communication/Game/Rooms/Lock/EnterRoomBellQueueEvent.js";
import LeaveRoomBellQueueEvent from "../Communication/Game/Rooms/Lock/LeaveRoomBellQueueEvent.js";
import UpdateRoomBellQueueEvent from "../Communication/Game/Rooms/Lock/UpdateRoomBellQueueEvent.js";
import GetUserProfileEvent from "../Communication/Game/Users/Profile/GetUserProfileEvent.js";
import DeleteShopFurnitureEvent from "../Communication/Game/Shop/Development/DeleteShopFurnitureEvent.js";
import GetFurnitureCrackableEvent from "../Communication/Game/Furniture/Crackable/GetFurnitureCrackableEvent.js";
import UpdateFurnitureCrackableEvent from "../Communication/Game/Furniture/Crackable/UpdateFurnitureCrackableEvent.js";
import RoomDoubleClickEvent from "../Communication/Game/Rooms/RoomDoubleClickEvent.js";
import GetAchievementsCategoriesEvent from "../Communication/Game/Achievements/GetAchievementsCategoriesEvent.js";
import GetAchievementsEvent from "../Communication/Game/Achievements/GetAchievementsEvent.js";
import UpdateShopFeatureEvent from "../Communication/Game/Shop/Development/UpdateShopFeatureEvent.js";
import GetShopFurnitureLinkEvent from "../Communication/Game/Shop/GetShopFurnitureLinkEvent.js";
import { randomUUID } from "node:crypto";
import GetUserClothesEvent from "../Communication/Game/Users/Clothes/GetUserClothesEvent.js";
import UpdateClothingEvent from "../Communication/Game/Clothing/UpdateClothingEvent.js";
import GetUserFiguresEvent from "../Communication/Game/Users/Figures/GetUserFiguresEvent.js";
import UserFigureEvent from "../Communication/Game/Users/Figures/UserFigureEvent.js";
import GetUserEffectsEvent from "../Communication/Game/Users/Effects/GetUserEffectsEvent.js";
import UpdateRoomFurnitureTraxSongEvent from "../Communication/Game/Rooms/Furniture/Trax/UpdateRoomFurnitureTraxSongEvent.js";
import UpdateRoomFurnitureTraxPlaylistEvent from "../Communication/Game/Rooms/Furniture/Trax/UpdateRoomFurnitureTraxPlaylistEvent.js";
import DeleteRoomFurnitureTraxSongEvent from "../Communication/Game/Rooms/Furniture/Trax/DeleteRoomFurnitureTraxSongEvent.js";
import BurnRoomFurnitureTraxSongEvent from "../Communication/Game/Rooms/Furniture/Trax/BurnRoomFurnitureTraxSongEvent.js";
import GetUserInventorySongDisksEvent from "../Communication/Game/Inventory/GetUserInventorySongDisksEvent.js";
import InsertRoomFurnitureTraxSongEvent from "../Communication/Game/Rooms/Furniture/Trax/InsertRoomFurnitureTraxSongEvent.js";
import GetUserInventorySoundSetsEvent from "../Communication/Game/Inventory/GetUserInventorySoundSetsEvent.js";

export default class EventHandler extends EventEmitter {
    constructor() {
        super();

        super.setMaxListeners(1);

        this.registerIncomingEvents();
    }

    public decodeAndDispatchMessages(user: User, rawData: RawData) {
        try {
            let buffer: Buffer;

            if (typeof rawData === "string") {
                buffer = Buffer.from(rawData);
            } else if (rawData instanceof Buffer) {
                buffer = rawData;
            } else if (rawData instanceof ArrayBuffer) {
                buffer = Buffer.from(rawData);
            } else if (Array.isArray(rawData)) {
                buffer = Buffer.concat(rawData);
            } else {
                throw new Error("Unsupported RawData type");
            }

            const sep = buffer.indexOf("|".charCodeAt(0));
            const type = buffer.subarray(0, sep).toString("utf-8");
            const payload = buffer.subarray(sep + 1);

            console.log("Received " + type);

            this.emit(type, user, payload, user.spamProtection.getDurationSinceLastEvent(type));

            // TODO: remove the user event handler?
            user.emit(type, user, payload, user.spamProtection.getDurationSinceLastEvent(type));
        }
        catch(error) {
            console.error("Failed to process Protobuff", error);
        }
    }

    addProtobuffListener<T>(message: MessageType, protobuffListener: ProtobuffListener<T>) {
        super.addListener(message.$type, (user: User, event, durationSinceLastEvent) => {
            if(protobuffListener.minimumDurationBetweenEvents !== undefined) {
                if(durationSinceLastEvent < protobuffListener.minimumDurationBetweenEvents) {
                    console.warn("Ignoring event from user, duration since last event " + durationSinceLastEvent + " is less than allowed " + protobuffListener.minimumDurationBetweenEvents);
                    
                    /*user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                        id: randomUUID(),
                        text: "You are doing that too quickly! Try again..."
                    }));*/

                    return;
                }
            }

            protobuffListener.handle(user, message.decode(event) as T).catch(console.error);

            user.spamProtection.registerEventTimestamp(message.$type);
        });

        return this;
    }

    removeProtobuffListener(message: MessageType, listener: (event: Uint8Array<ArrayBufferLike>) => void) {
        super.removeListener(message.$type, listener);
    }

    registerIncomingEvents() {
        // Achievement events
        this.addProtobuffListener(GetAchievementsCategoriesData, new GetAchievementsCategoriesEvent());
        this.addProtobuffListener(GetAchievementsData, new GetAchievementsEvent());

        // Hotel events
        this.addProtobuffListener(SendHotelFeedbackData, new SendHotelFeedbackEvent());

        // Badge events
        this.addProtobuffListener(UpdateBadgeData, new UpdateBadgeEvent());
        this.addProtobuffListener(GetBadgeBrowserData, new GetBadgeBrowserEvent());

        // Furniture events
        this.addProtobuffListener(UpdateFurnitureData, new UpdateFurnitureEvent());
        this.addProtobuffListener(GetFurnitureBrowserData, new GetFurnitureBrowserEvent());

        // Room events
        this.addProtobuffListener(CreateRoomData, new CreateRoomEvent());

        // Room bell events
        this.addProtobuffListener(EnterRoomBellQueueData, new EnterRoomBellQueueEvent());
        this.addProtobuffListener(ExitRoomBellQueueData, new LeaveRoomBellQueueEvent());
        this.addProtobuffListener(UpdateRoomBellQueueData, new UpdateRoomBellQueueEvent());

        // Shop events
        this.addProtobuffListener(GetShopPagesData, new GetShopPagesEvent());
        this.addProtobuffListener(GetShopPageFurnitureData, new GetShopPageFurnitureEvent());
        this.addProtobuffListener(GetShopPageBotsData, new GetShopPageBotsEvent());
        this.addProtobuffListener(PurchaseShopFurnitureData, new PurchaseShopFurnitureEvent());
        this.addProtobuffListener(PurchaseShopBotData, new PurchaseShopBotEvent());

        // Shop furniture events
        this.addProtobuffListener(DeleteShopFurnitureData, new DeleteShopFurnitureEvent());
        this.addProtobuffListener(GetShopFurnitureLinkData, new GetShopFurnitureLinkEvent());

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

        // User inventory furniture
        this.addProtobuffListener(GetUserInventorySongDisksData, new GetUserInventorySongDisksEvent());
        this.addProtobuffListener(GetUserInventorySoundSetsData, new GetUserInventorySoundSetsEvent());

        // User inventory pets
        this.addProtobuffListener(GetUserInventoryPetsData, new GetUserInventoryPetsEvent());

        // User profile events
        this.addProtobuffListener(GetUserProfileData, new GetUserProfileEvent());

        // Room pet events
        this.addProtobuffListener(PlaceRoomPetData, new PlaceRoomPetEvent());
        this.addProtobuffListener(PickupRoomPetData, new PickupRoomPetEvent());

        // Pet events
        this.addProtobuffListener(GetPetBrowserData, new GetPetBrowserEvent());
        this.addProtobuffListener(GetPetBreedsData, new GetPetBreedsEvent());
        this.addProtobuffListener(UpdatePetData, new UpdatePetEvent());

        // User friends events
        this.addProtobuffListener(GetUserFriendsData, new GetUserFriendsEvent());
        this.addProtobuffListener(SendUserFriendRequestData, new SendUserFriendRequestEvent());
        this.addProtobuffListener(UpdateUserFriendRequestData, new UpdateUserFriendRequestEvent());
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

        // Room furniture events
        this.addProtobuffListener(UpdateRoomFurnitureTraxSongData, new UpdateRoomFurnitureTraxSongEvent());
        this.addProtobuffListener(UpdateRoomFurnitureTraxPlaylistData, new UpdateRoomFurnitureTraxPlaylistEvent());
        this.addProtobuffListener(DeleteRoomFurnitureTraxSongData, new DeleteRoomFurnitureTraxSongEvent());
        this.addProtobuffListener(BurnRoomFurnitureTraxSongData, new BurnRoomFurnitureTraxSongEvent());
        this.addProtobuffListener(InsertRoomFurnitureTraxSongData, new InsertRoomFurnitureTraxSongEvent());

        this.addProtobuffListener(RoomReadyData, new RoomReadyEvent());
        this.addProtobuffListener(RoomClickData, new RoomClickEvent());
        this.addProtobuffListener(RoomDoubleClickData, new RoomDoubleClickEvent());
            
        this
            .addProtobuffListener(EnterRoomData, new EnterRoomEvent())
            .addProtobuffListener(LeaveRoomData, new LeaveRoomEvent())
            .addProtobuffListener(PlaceRoomFurnitureData, new PlaceFurnitureEvent())
            .addProtobuffListener(PlaceRoomBotData, new PlaceBotEvent())
            .addProtobuffListener(PlaceRoomContentFurnitureData, new PlaceRoomContentFurnitureEvent())
            .addProtobuffListener(UseRoomFurnitureData, new UseRoomFurnitureEvent())
            .addProtobuffListener(UpdateRoomFurnitureData, new UpdateRoomFurnitureEvent())
            .addProtobuffListener(UpdateRoomBotData, new UpdateRoomBotEvent())
            .addProtobuffListener(PickupRoomFurnitureData, new PickupRoomFurnitureEvent())
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
