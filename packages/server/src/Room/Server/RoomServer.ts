import { ServerLoadRoomData } from "@pixel63/events";
import CommandHandler from "../Commands/CommandHandler";
import PetCommandHandler from "../Rooms/Pets/Commands/PetCommandHandler";
import ServerLoadRoomEvent from "../Events/Server/ServerLoadRoomEvent";
import RoomManager from "../Rooms/RoomManager";
import HotelSettings from "../../Game/Hotel/HotelSettings";
import RoomWebSocketServer from "./WebSocket/RoomWebSocketServer";

export default class RoomServer {
    public websocket: RoomWebSocketServer;

    public readonly commandHandler: CommandHandler;
    public readonly petCommandHandler: PetCommandHandler;

    public readonly roomManager: RoomManager;

    public readonly hotelSettings: HotelSettings;

    constructor() {
        this.websocket = new RoomWebSocketServer(this);
        
        this.commandHandler = new CommandHandler();
        this.petCommandHandler = new PetCommandHandler();

        this.hotelSettings = new HotelSettings();

        this.roomManager = new RoomManager();

        this.registerServerEvents();
    }

    private registerServerEvents() {
        this.websocket.serverEventHandler.addProtobuffListener(ServerLoadRoomData, new ServerLoadRoomEvent());
    }
}
