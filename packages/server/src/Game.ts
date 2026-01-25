import RoomNavigatorManager from "./Rooms/Navigator/RoomNavigatorManager.js";
import RoomManager from "./Rooms/RoomManager.js";
import User from "./Users/User.js";
import WebSocket from "./WebSocket/WebSocket.js";

export default class Game {
    public readonly roomManager;
    public readonly roomNavigatorManager;

    public readonly webSocket;

    public readonly users: User[];

    constructor() {
        this.roomNavigatorManager = new RoomNavigatorManager();
        this.roomManager = new RoomManager();
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
