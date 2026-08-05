import RoomWebSocketServer from "./WebSocket/RoomWebSocketServer";

export default class RoomServer {
    public websocket: RoomWebSocketServer;

    constructor(public readonly accessToken: string) {
        this.websocket = new RoomWebSocketServer(this);   
    }
}
