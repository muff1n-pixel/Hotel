import EventHandler from "./Events/UserEventHandler.js";
import User from "./Users/User.js";
import WebSocket from "./WebSocket/WebSocket.js";
import HotelInformation from "./Hotel/HotelInformation.js";
import UserAchievements from "./Users/Achievements/UserAchievements.js";
import HotelSettings from "./Hotel/HotelSettings.js";
import HotelActivityRewards from "./Hotel/HotelActivityRewards.js";
import { ServerTokenModel } from "../Database/Models/Server/ServerTokenModel.js";
import { randomBytes, randomUUID } from "node:crypto";
import RoomWorkerPool from "./Rooms/RoomWorkerPool.js";
import RoomNavigatorManager from "./Rooms/Navigator/RoomNavigatorManager.js";

export default class Game {
    public readonly hotelInformation;
    public readonly hotelSettings;
    public readonly hotelActivityRewards;

    public readonly roomWorkerPool;
    public readonly roomNavigatorManager;

    public readonly eventHandler;
    public readonly webSocket;

    public readonly secretKey: string = randomBytes(32).toString("hex");

    public readonly users: User[];

    constructor() {
        this.hotelInformation = new HotelInformation();
        this.hotelSettings = new HotelSettings();
        this.hotelActivityRewards = new HotelActivityRewards(this);

        this.roomWorkerPool = new RoomWorkerPool(this);
        this.roomNavigatorManager = new RoomNavigatorManager();

        this.eventHandler = new EventHandler();
        this.webSocket = new WebSocket();

        this.users = [];
    }

    public async loadModels() {
        await this.roomNavigatorManager.loadModels();
        await this.hotelSettings.loadModels();
    }

    public async createServerToken() {
        await ServerTokenModel.destroy({
            truncate: true
        });
    
        await ServerTokenModel.create({
            id: randomUUID(),
            secretKey: this.secretKey
        });
    }

    public getUserById(id: string) {
        return this.users.find((user) => user.model.id === id);
    }

    public getUserAchievements(userId: string) {
        const user = this.getUserById(userId);

        return user?.achievements ?? new UserAchievements(userId);
    }
}
