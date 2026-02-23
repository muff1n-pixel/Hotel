import CommandHandler from "./Commands/CommandHandler.js";
import { UserModel } from "./Database/Models/Users/UserModel.js";
import EventHandler from "./Events/EventHandler.js";
import RoomNavigatorManager from "./Rooms/Navigator/RoomNavigatorManager.js";
import RoomManager from "./Rooms/RoomManager.js";
import User from "./Users/User.js";
import WebSocket from "./WebSocket/WebSocket.js";
import HotelInformation from "./Hotel/HotelInformation.js";

export default class Game {
    public readonly hotelInformation;

    public readonly roomManager;
    public readonly roomNavigatorManager;

    public readonly commandHandler;
    public readonly eventHandler;
    public readonly webSocket;

    public readonly users: User[];

    constructor() {
        this.hotelInformation = new HotelInformation();

        this.roomNavigatorManager = new RoomNavigatorManager();
        this.roomManager = new RoomManager();

        this.commandHandler = new CommandHandler();
        this.eventHandler = new EventHandler();
        this.webSocket = new WebSocket();

        this.users = [];
    }

    public async loadModels() {
        await this.roomNavigatorManager.loadModels();
    }

    public getUserById(id: string) {
        return this.users.find((user) => user.model.id === id);
    }
}
