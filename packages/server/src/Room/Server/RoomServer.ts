import CommandHandler from "../Commands/CommandHandler";
import PetCommandHandler from "../Rooms/Pets/Commands/PetCommandHandler";
import RoomWebSocketServer from "./WebSocket/RoomWebSocketServer";

export default class RoomServer {
    public websocket: RoomWebSocketServer;

    public readonly commandHandler: CommandHandler;
    public readonly petCommandHandler: PetCommandHandler;

    constructor() {
        this.websocket = new RoomWebSocketServer(this);  
        
        this.commandHandler = new CommandHandler();
        this.petCommandHandler = new PetCommandHandler(); 
    }
}
