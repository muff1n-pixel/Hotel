import { BurnRoomFurnitureTraxSongData, ClearRoomRightsData, DeleteRoomFurnitureTraxSongData, GetRoomChatStylesData, GetRoomRightsData, GetRoomWiredLogsData, GetRoomWiredMonitorData, GetUserBotSpeechData, InsertRoomFurnitureTraxSongData, PickupAllRoomFurnitureData, PickupRoomBotData, PickupRoomFurnitureData, PickupRoomPetData, PlaceRoomBotData, PlaceRoomContentFurnitureData, PlaceRoomFurnitureData, PlaceRoomPetData, RequestRoomUserTradingData, ResetRoomClickConfigurationData, RoomClickData, RoomDoubleClickData, RoomReadyData, ScratchRoomPetData, SendRoomChatMessageData, SendRoomUserWalkData, ServerLoadRoomData, ServerRemoveUserFromRoomData, SetRoomChatTypingData, SetRoomClickConfigurationData, SetRoomUserRightsData, UpdateRoomBotData, UpdateRoomFurnitureData, UpdateRoomFurnitureTraxPlaylistData, UpdateRoomFurnitureTraxSongData, UpdateRoomInformationData, UpdateRoomStructureData, UpdateRoomUserTradingData, UseRoomFurnitureData } from "@pixel63/events";
import CommandHandler from "./Commands/CommandHandler";
import PetCommandHandler from "./Rooms/Pets/Commands/PetCommandHandler";
import ServerLoadRoomEvent from "./Events/Server/ServerLoadRoomEvent";
import RoomManager from "./Rooms/RoomManager";
import HotelSettings from "../Game/Hotel/HotelSettings";
import RoomWebSocket from "./WebSocket/RoomWebSocket";
import PlaceRoomPetEvent from "./Events/Rooms/Pets/PlaceRoomPetEvent";
import PickupRoomPetEvent from "./Events/Rooms/Pets/PickupRoomPetEvent";
import ScratchRoomPetEvent from "./Events/Rooms/Pets/ScratchRoomPetEvent";
import SetRoomClickConfigurationEvent from "./Events/Rooms/Configuration/SetRoomClickConfigurationEvent";
import ResetRoomClickConfigurationEvent from "./Events/Rooms/Configuration/ResetRoomClickConfigurationEvent";
import UpdateRoomFurnitureTraxSongEvent from "./Events/Rooms/Furniture/Trax/UpdateRoomFurnitureTraxSongEvent";
import UpdateRoomFurnitureTraxPlaylistEvent from "./Events/Rooms/Furniture/Trax/UpdateRoomFurnitureTraxPlaylistEvent";
import DeleteRoomFurnitureTraxSongEvent from "./Events/Rooms/Furniture/Trax/DeleteRoomFurnitureTraxSongEvent";
import BurnRoomFurnitureTraxSongEvent from "./Events/Rooms/Furniture/Trax/BurnRoomFurnitureTraxSongEvent";
import InsertRoomFurnitureTraxSongEvent from "./Events/Rooms/Furniture/Trax/InsertRoomFurnitureTraxSongEvent";
import RequestRoomUserTradingEvent from "./Events/Rooms/User/Trading/RequestRoomUserTradingEvent";
import UpdateRoomUserTradingEvent from "./Events/Rooms/User/Trading/UpdateRoomUserTradingEvent";
import GetRoomWiredMonitorEvent from "./Events/Rooms/Wired/GetRoomWiredMonitorEvent";
import GetRoomWiredLogsEvent from "./Events/Rooms/Wired/GetRoomWiredLogsEvent";
import GetRoomRightsEvent from "./Events/Rooms/Rights/GetRoomRightsEvent";
import ClearRoomRightsEvent from "./Events/Rooms/Rights/ClearRoomRightsEvent";
import RoomReadyEvent from "./Rooms/RoomReadyEvent";
import RoomClickEvent from "./Events/Rooms/RoomClickEvent";
import RoomDoubleClickEvent from "./Events/Rooms/RoomDoubleClickEvent";
import PlaceFurnitureEvent from "./Events/Rooms/Furniture/PlaceFurnitureEvent";
import PlaceBotEvent from "./Events/Rooms/Bots/PlaceBotEvent";
import PlaceRoomContentFurnitureEvent from "./Events/Rooms/Furniture/PlaceRoomContentFurnitureEvent";
import UseRoomFurnitureEvent from "./Events/Rooms/Furniture/UseRoomFurnitureEvent";
import UpdateRoomFurnitureEvent from "./Events/Rooms/Furniture/UpdateRoomFurnitureEvent";
import UpdateRoomBotEvent from "./Events/Rooms/Bots/UpdateRoomBotEvent";
import PickupRoomFurnitureEvent from "./Events/Rooms/Furniture/PickupRoomFurnitureEvent";
import PickupAllRoomFurnitureEvent from "./Events/Rooms/Furniture/PickupAllRoomFurnitureEvent";
import PickupRoomBotEvent from "./Events/Rooms/Bots/PickupRoomBotEvent";
import StartWalkingEvent from "./Events/Rooms/User/StartWalkingEvent";
import SendUserMessageEvent from "./Events/Rooms/User/SendUserMessageEvent";
import GetRoomChatStylesEvent from "./Events/Rooms/Chat/Styles/GetRoomChatStylesEvent";
import UpdateRoomStructureEvent from "./Events/Rooms/UpdateRoomStructureEvent";
import UpdateRoomInformationEvent from "./Events/Rooms/UpdateRoomInformationEvent";
import UpdateUserRightsEvent from "./Events/Rooms/User/UpdateUserRightsEvent";
import SetTypingEvent from "./Events/Rooms/User/SetTypingEvent";
import GetRoomBotSpeechEvent from "./Events/Rooms/Bots/GetRoomBotSpeechEvent";
import ServerRemoveUserFromRoomEvent from "./Events/Server/ServerRemoveUserFromRoomEvent";
import { logger } from "./RoomLogger";

export default class RoomServer {
    public static readonly websocket: RoomWebSocket = new RoomWebSocket();

    public static readonly commandHandler: CommandHandler = new CommandHandler();
    public static readonly petCommandHandler: PetCommandHandler = new PetCommandHandler();

    public static readonly roomManager: RoomManager = new RoomManager();

    public static readonly hotelSettings: HotelSettings = new HotelSettings();

    public static async start() {
        await this.hotelSettings.loadModels();

        this.registerServerEvents();
        this.registerUserEvents();

        logger.info("Room server has started.");
    }

    private static registerServerEvents() {
        this.websocket.serverEventHandler.addProtobuffListener(ServerLoadRoomData, new ServerLoadRoomEvent());
        this.websocket.serverEventHandler.addProtobuffListener(ServerRemoveUserFromRoomData, new ServerRemoveUserFromRoomEvent());
    }

    private static registerUserEvents() {
        // Room pet events
        this.websocket.userEventHandler.addProtobuffListener(PlaceRoomPetData, new PlaceRoomPetEvent());
        this.websocket.userEventHandler.addProtobuffListener(PickupRoomPetData, new PickupRoomPetEvent());
        this.websocket.userEventHandler.addProtobuffListener(ScratchRoomPetData, new ScratchRoomPetEvent());

        // Room click configuration
        this.websocket.userEventHandler.addProtobuffListener(SetRoomClickConfigurationData, new SetRoomClickConfigurationEvent());
        this.websocket.userEventHandler.addProtobuffListener(ResetRoomClickConfigurationData, new ResetRoomClickConfigurationEvent());

        // Room furniture events
        this.websocket.userEventHandler.addProtobuffListener(UpdateRoomFurnitureTraxSongData, new UpdateRoomFurnitureTraxSongEvent());
        this.websocket.userEventHandler.addProtobuffListener(UpdateRoomFurnitureTraxPlaylistData, new UpdateRoomFurnitureTraxPlaylistEvent());
        this.websocket.userEventHandler.addProtobuffListener(DeleteRoomFurnitureTraxSongData, new DeleteRoomFurnitureTraxSongEvent());
        this.websocket.userEventHandler.addProtobuffListener(BurnRoomFurnitureTraxSongData, new BurnRoomFurnitureTraxSongEvent());
        this.websocket.userEventHandler.addProtobuffListener(InsertRoomFurnitureTraxSongData, new InsertRoomFurnitureTraxSongEvent());

        // Room user trading
        this.websocket.userEventHandler.addProtobuffListener(RequestRoomUserTradingData, new RequestRoomUserTradingEvent());
        this.websocket.userEventHandler.addProtobuffListener(UpdateRoomUserTradingData, new UpdateRoomUserTradingEvent());

        // Room wired events
        this.websocket.userEventHandler.addProtobuffListener(GetRoomWiredMonitorData, new GetRoomWiredMonitorEvent());
        this.websocket.userEventHandler.addProtobuffListener(GetRoomWiredLogsData, new GetRoomWiredLogsEvent());

        // Room rights events
        this.websocket.userEventHandler.addProtobuffListener(GetRoomRightsData, new GetRoomRightsEvent());
        this.websocket.userEventHandler.addProtobuffListener(ClearRoomRightsData, new ClearRoomRightsEvent());

        this.websocket.userEventHandler.addProtobuffListener(RoomReadyData, new RoomReadyEvent());
        this.websocket.userEventHandler.addProtobuffListener(RoomClickData, new RoomClickEvent());
        this.websocket.userEventHandler.addProtobuffListener(RoomDoubleClickData, new RoomDoubleClickEvent());
            
        this.websocket.userEventHandler.addProtobuffListener(PlaceRoomFurnitureData, new PlaceFurnitureEvent());
        this.websocket.userEventHandler.addProtobuffListener(PlaceRoomBotData, new PlaceBotEvent());
        this.websocket.userEventHandler.addProtobuffListener(PlaceRoomContentFurnitureData, new PlaceRoomContentFurnitureEvent());
        this.websocket.userEventHandler.addProtobuffListener(UseRoomFurnitureData, new UseRoomFurnitureEvent());
        this.websocket.userEventHandler.addProtobuffListener(UpdateRoomFurnitureData, new UpdateRoomFurnitureEvent());
        this.websocket.userEventHandler.addProtobuffListener(UpdateRoomBotData, new UpdateRoomBotEvent());
        this.websocket.userEventHandler.addProtobuffListener(PickupRoomFurnitureData, new PickupRoomFurnitureEvent());
        this.websocket.userEventHandler.addProtobuffListener(PickupAllRoomFurnitureData, new PickupAllRoomFurnitureEvent());
        this.websocket.userEventHandler.addProtobuffListener(PickupRoomBotData, new PickupRoomBotEvent());
        this.websocket.userEventHandler.addProtobuffListener(SendRoomUserWalkData, new StartWalkingEvent());
        this.websocket.userEventHandler.addProtobuffListener(SendRoomChatMessageData, new SendUserMessageEvent());
        this.websocket.userEventHandler.addProtobuffListener(GetRoomChatStylesData, new GetRoomChatStylesEvent());
        this.websocket.userEventHandler.addProtobuffListener(UpdateRoomStructureData, new UpdateRoomStructureEvent());
        this.websocket.userEventHandler.addProtobuffListener(UpdateRoomInformationData, new UpdateRoomInformationEvent());
        this.websocket.userEventHandler.addProtobuffListener(SetRoomUserRightsData, new UpdateUserRightsEvent());
            
        this.websocket.userEventHandler.addProtobuffListener(SetRoomChatTypingData, new SetTypingEvent());
            
        this.websocket.userEventHandler.addProtobuffListener(GetUserBotSpeechData, new GetRoomBotSpeechEvent());
    }
}
