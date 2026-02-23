import { EventEmitter } from "node:events";
import IncomingCommandHandler from "./Interfaces/IncomingCommandHandler.js";
import RoomUser from "../Rooms/Users/RoomUser.js";
import SitCommand from "./Handlers/SitCommand.js";
import WaveCommand from "./Handlers/WaveCommand.js";
import EnableCommand from "./Handlers/EnableCommand.js";
import SpeedCommand from "./Handlers/SpeedCommand.js";
import CarryCommand from "./Handlers/CarryCommand.js";
import TeleportCommand from "./Handlers/TeleportCommand.js";
import GiveCommand from "./Handlers/GiveCommand.js";

export default class CommandHandler extends EventEmitter {
    constructor() {
        super();

        this.registerCommands();
    }
    
    public dispatchCommand(roomUser: RoomUser, command: string, inputs: string[]) {
        this.emit(command, roomUser, inputs);
    }

    public addCommand<T>(incomingCommandHandler: IncomingCommandHandler): this {
        return super.addListener(incomingCommandHandler.command, async (roomUser, inputs) => {
            try {
                await incomingCommandHandler.handle(roomUser, inputs);
            }
            catch(error) {
                console.error(error);
            }
        });
    }

    private registerCommands() {
        this
            .addCommand(new SitCommand())
            .addCommand(new WaveCommand())
            .addCommand(new EnableCommand())
            .addCommand(new CarryCommand())
            .addCommand(new SpeedCommand());

        this.addCommand(new TeleportCommand());
        this.addCommand(new GiveCommand());
    }
}