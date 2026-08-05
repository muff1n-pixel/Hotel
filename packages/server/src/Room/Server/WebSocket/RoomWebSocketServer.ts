import WebSocket, { RawData, WebSocketServer } from "ws";
import { config } from "../../../Game/Config/Config";
import { IncomingMessage } from "http";
import jsonWebToken from "jsonwebtoken";
import RoomServer from "../RoomServer";
import { MessageType, UnknownMessage } from "@pixel63/events";
import { ServerTokenModel } from "../../../Database/Models/Server/ServerTokenModel";
import EventHandler from "../../../Communication/EventHandler";

export default class RoomWebSocketServer {
    private readonly server: WebSocketServer;
    private gameServerWebSocket?: WebSocket;

    public eventHandler = new EventHandler();

    constructor(private readonly roomServer: RoomServer) {
        this.server = new WebSocketServer({
            host: config.hostname,
            port: 8081 // TODO: support port in arguments
        });

        this.server.addListener("connection", this.handleConnection.bind(this));
        this.server.addListener("message", this.handleMessage.bind(this));
    }

    private async handleConnection(websocket: WebSocket, request: IncomingMessage) {
        if(!request.url) {
            console.error("Connection does not contain a URL.");

            websocket.close();

            return;
        }

        const url = new URL(request.url, "http://localhost");

        const accessToken = url.searchParams.get("accessToken");

        if(!accessToken) {
            console.warn("No access token provided.");

            websocket.close();

            return;
        }

        if(url.searchParams.get("type") === "server") {
            await this.handleServerConnection(websocket, request, accessToken, url);
        }
        else {
            this.handleUserConnection(websocket, request, accessToken, url);
        }
    }

    private async handleServerConnection(websocket: WebSocket, request: IncomingMessage, accessToken: string, url: URL) {
        const serverToken = await ServerTokenModel.findOne();

        if(!serverToken) {
            console.error("Server access token does not exist!");

            websocket.close();

            return;
        }

        const payload = this.getAccessTokenPayload(accessToken, serverToken.secretKey);

        if(!payload) {
            console.error("Server access token is invalid.");

            websocket.close();

            return;
        }

        this.gameServerWebSocket = websocket;

        console.log("[RoomWebSocketServer] Connected to game server!");
    }

    private handleUserConnection(websocket: WebSocket, request: IncomingMessage, accessToken: string, url: URL) {
        websocket.close();
    }
    
    private async handleMessage(data: RawData) {
        this.eventHandler.decodeAndDispatchMessages(null, data);
    }

    public sendServerProtobuff<Message extends UnknownMessage = UnknownMessage>(message: MessageType, payload: Message) {
        return this.sendProtobuff(this.gameServerWebSocket!, message, payload);
    }

    public sendProtobuff<Message extends UnknownMessage = UnknownMessage>(websocket: WebSocket, message: MessageType, payload: Message) {
        try {
            const encoded = message.encode(payload).finish();

            this.sendEncodedProtobuff(websocket, message.$type, encoded);
        }
        catch(error) {
            console.error("Failed to send Protobuff", error);
        }
    }

    private sendEncodedProtobuff(websocket: WebSocket, eventType: string, encoded: Uint8Array) {
        try {
            const typeBytes = new TextEncoder().encode(eventType + "|");

            const message = new Uint8Array(typeBytes.length + encoded.length);

            message.set(typeBytes, 0);
            message.set(encoded, typeBytes.length);

            websocket.send(message);
        }
        catch(error) {
            console.error("Failed to send encoded Protobuff", error);
        }
    }

    private getAccessTokenPayload<T>(accessToken: string, secretKey: string) {
        try {
            const payload = jsonWebToken.verify(accessToken, secretKey);

            if(typeof payload === "string") {
                console.error("Access token payload is a string.");

                return null;
            }

            return payload;
        }
        catch(error) {
            console.error(error);

            return null;
        }
    }
}
