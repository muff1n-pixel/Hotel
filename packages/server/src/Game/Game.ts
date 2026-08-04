import CommandHandler from "./Commands/CommandHandler.js";
import EventHandler from "./Events/EventHandler.js";
import RoomNavigatorManager from "./Rooms/Navigator/RoomNavigatorManager.js";
import RoomManager from "./Rooms/RoomManager.js";
import User from "./Users/User.js";
import WebSocket from "./WebSocket/WebSocket.js";
import HotelInformation from "./Hotel/HotelInformation.js";
import UserAchievements from "./Users/Achievements/UserAchievements.js";
import HotelSettings from "./Hotel/HotelSettings.js";
import HotelActivityRewards from "./Hotel/HotelActivityRewards.js";
import PetCommandHandler from "./Rooms/Pets/Commands/PetCommandHandler.js";

export default class Game {
    public readonly hotelInformation;
    public readonly hotelSettings;
    public readonly hotelActivityRewards;

    public readonly roomManager;
    public readonly roomNavigatorManager;

    public readonly commandHandler;
    public readonly petCommandHandler;
    public readonly eventHandler;
    public readonly webSocket;

    public readonly users: User[];

    constructor() {
        this.hotelInformation = new HotelInformation();
        this.hotelSettings = new HotelSettings();
        this.hotelActivityRewards = new HotelActivityRewards(this);

        this.roomNavigatorManager = new RoomNavigatorManager();
        this.roomManager = new RoomManager();

        this.commandHandler = new CommandHandler();
        this.petCommandHandler = new PetCommandHandler();
        this.eventHandler = new EventHandler();
        this.webSocket = new WebSocket();

        this.users = [];
    }

    public async loadModels() {
        await this.hotelSettings.loadModels();
        await this.roomNavigatorManager.loadModels();
    }

    public getUserById(id: string) {
        return this.users.find((user) => user.model.id === id);
    }

    public getUserAchievements(userId: string) {
        const user = this.getUserById(userId);

        return user?.achievements ?? new UserAchievements(userId);
    }
}
