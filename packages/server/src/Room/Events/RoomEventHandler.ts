import PlaceFurnitureEvent from "./Rooms/Furniture/PlaceFurnitureEvent.js";
import StartWalkingEvent from "./Rooms/User/StartWalkingEvent.js";
import PickupRoomFurnitureEvent from "./Rooms/Furniture/PickupRoomFurnitureEvent.js";
import UseRoomFurnitureEvent from "./Rooms/Furniture/UseRoomFurnitureEvent.js";
import PlaceRoomContentFurnitureEvent from "./Rooms/Furniture/PlaceRoomContentFurnitureEvent.js";
import SendUserMessageEvent from "./Rooms/User/SendUserMessageEvent.js";
import GetRoomChatStylesEvent from "./Rooms/Chat/Styles/GetRoomChatStylesEvent.js";
import UpdateRoomFurnitureEvent from "./Rooms/Furniture/UpdateRoomFurnitureEvent.js";
import UpdateRoomStructureEvent from "./Rooms/UpdateRoomStructureEvent.js";
import UpdateRoomInformationEvent from "./Rooms/UpdateRoomInformationEvent.js";
import UpdateUserRightsEvent from "./Rooms/User/UpdateUserRightsEvent.js";
import SetTypingEvent from "./Rooms/User/SetTypingEvent.js";
import PlaceBotEvent from "./Rooms/Bots/PlaceBotEvent.js";
import PickupRoomBotEvent from "./Rooms/Bots/PickupRoomBotEvent.js";
import UpdateRoomBotEvent from "./Rooms/Bots/UpdateRoomBotEvent.js";
import GetRoomBotSpeechEvent from "./Rooms/Bots/GetRoomBotSpeechEvent.js";
import RoomReadyEvent from "../Rooms/RoomReadyEvent.js";
import RoomClickEvent from "./Rooms/RoomClickEvent.js";
import { BurnRoomFurnitureTraxSongData, ClearRoomRightsData, DeleteRoomFurnitureTraxSongData, GetRoomChatStylesData, GetRoomRightsData, GetRoomWiredLogsData, GetRoomWiredMonitorData, GetUserBotSpeechData, InsertRoomFurnitureTraxSongData, LeaveRoomData, PickupAllRoomFurnitureData, PickupRoomBotData, PickupRoomFurnitureData, PickupRoomPetData, PlaceRoomBotData, PlaceRoomContentFurnitureData, PlaceRoomFurnitureData, PlaceRoomPetData, PurchaseRoomCameraPhotoData, RequestRoomUserTradingData, ResetRoomClickConfigurationData, RoomClickData, RoomDoubleClickData, RoomFurnitureImportData, RoomReadyData, ScratchRoomPetData, SendRoomChatMessageData, SendRoomUserWalkData, SetRoomChatTypingData, SetRoomClickConfigurationData, SetRoomUserRightsData, UpdateRoomBellQueueData, UpdateRoomBotData, UpdateRoomFurnitureData, UpdateRoomFurnitureTraxPlaylistData, UpdateRoomFurnitureTraxSongData, UpdateRoomInformationData, UpdateRoomMapData, UpdateRoomStructureData, UpdateRoomUserTradingData, UpdateShopBotData, UpdateShopFeatureData, UpdateShopFurnitureData, UpdateShopMembershipData, UpdateShopPageData, UpdateShopPetData, UpdateUserBadgeData, UpdateUserFriendRelationshipData, UpdateUserFriendRequestData, UserFigureData, UseRoomFurnitureData } from "@pixel63/events";
import PlaceRoomPetEvent from "./Rooms/Pets/PlaceRoomPetEvent.js";
import PickupRoomPetEvent from "./Rooms/Pets/PickupRoomPetEvent.js";
import RoomDoubleClickEvent from "./Rooms/RoomDoubleClickEvent.js";
import UpdateRoomFurnitureTraxSongEvent from "./Rooms/Furniture/Trax/UpdateRoomFurnitureTraxSongEvent.js";
import UpdateRoomFurnitureTraxPlaylistEvent from "./Rooms/Furniture/Trax/UpdateRoomFurnitureTraxPlaylistEvent.js";
import DeleteRoomFurnitureTraxSongEvent from "./Rooms/Furniture/Trax/DeleteRoomFurnitureTraxSongEvent.js";
import BurnRoomFurnitureTraxSongEvent from "./Rooms/Furniture/Trax/BurnRoomFurnitureTraxSongEvent.js";
import InsertRoomFurnitureTraxSongEvent from "./Rooms/Furniture/Trax/InsertRoomFurnitureTraxSongEvent.js";
import SetRoomClickConfigurationEvent from "./Rooms/Configuration/SetRoomClickConfigurationEvent.js";
import ResetRoomClickConfigurationEvent from "./Rooms/Configuration/ResetRoomClickConfigurationEvent.js";
import PickupAllRoomFurnitureEvent from "./Rooms/Furniture/PickupAllRoomFurnitureEvent.js";
import RequestRoomUserTradingEvent from "./Rooms/User/Trading/RequestRoomUserTradingEvent.js";
import UpdateRoomUserTradingEvent from "./Rooms/User/Trading/UpdateRoomUserTradingEvent.js";
import GetRoomWiredMonitorEvent from "./Rooms/Wired/GetRoomWiredMonitorEvent.js";
import GetRoomWiredLogsEvent from "./Rooms/Wired/GetRoomWiredLogsEvent.js";
import GetRoomRightsEvent from "./Rooms/Rights/GetRoomRightsEvent.js";
import ClearRoomRightsEvent from "./Rooms/Rights/ClearRoomRightsEvent.js";
import ScratchRoomPetEvent from "./Rooms/Pets/ScratchRoomPetEvent.js";
import EventHandler from "../../Communication/EventHandler.js";
import RoomWebSocketUser from "../Server/Users/RoomWebSocketUser.js";

export default class RoomEventHandler extends EventHandler<RoomWebSocketUser> {
    constructor() {
        super();

        this.registerIncomingEvents();
    }

    registerIncomingEvents() {
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
            
        this.addProtobuffListener(PlaceRoomFurnitureData, new PlaceFurnitureEvent());
        this.addProtobuffListener(PlaceRoomBotData, new PlaceBotEvent());
        this.addProtobuffListener(PlaceRoomContentFurnitureData, new PlaceRoomContentFurnitureEvent());
        this.addProtobuffListener(UseRoomFurnitureData, new UseRoomFurnitureEvent());
        this.addProtobuffListener(UpdateRoomFurnitureData, new UpdateRoomFurnitureEvent());
        this.addProtobuffListener(UpdateRoomBotData, new UpdateRoomBotEvent());
        this.addProtobuffListener(PickupRoomFurnitureData, new PickupRoomFurnitureEvent());
        this.addProtobuffListener(PickupAllRoomFurnitureData, new PickupAllRoomFurnitureEvent());
        this.addProtobuffListener(PickupRoomBotData, new PickupRoomBotEvent());
        this.addProtobuffListener(SendRoomUserWalkData, new StartWalkingEvent());
        this.addProtobuffListener(SendRoomChatMessageData, new SendUserMessageEvent());
        this.addProtobuffListener(GetRoomChatStylesData, new GetRoomChatStylesEvent());
        this.addProtobuffListener(UpdateRoomStructureData, new UpdateRoomStructureEvent());
        this.addProtobuffListener(UpdateRoomInformationData, new UpdateRoomInformationEvent());
        this.addProtobuffListener(SetRoomUserRightsData, new UpdateUserRightsEvent());;
            
        this.addProtobuffListener(SetRoomChatTypingData, new SetTypingEvent());
            
        this.addProtobuffListener(GetUserBotSpeechData, new GetRoomBotSpeechEvent());
    }
}
