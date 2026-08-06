import WebSocket, { RawData } from "ws";
import { MessageType, UnknownMessage } from "@pixel63/events";
import EventHandler from "../../Communication/EventHandler";
import Game from "../Game";
import jsonWebToken from "jsonwebtoken";
import RoomWorker from "./RoomWorker";

export default class RoomWorkerWebSocket {
    private readonly websocket: WebSocket;

    public readonly eventHandler: EventHandler<RoomWorker> = new EventHandler((_: RoomWorker, type: string) => console.log(`[RoomWebSocketServer:${this.port}] Received message ${type}`));

    constructor(private readonly server: RoomWorker, private readonly game: Game, public readonly host: string, public readonly port: number) {
        const url = new URL(`ws://${host}:${port}`);

        const accessToken = jsonWebToken.sign(
            {},
            game.secretKey,
            { expiresIn: "1 Year" }
        );

        url.searchParams.set("type", "server");
        url.searchParams.set("accessToken", accessToken);

        this.websocket = new WebSocket(url);

        console.log(`[RoomServerClient:${port}] Connecting to the room server...`);

        this.websocket.addListener("open", this.handleConnected.bind(this));
        this.websocket.addListener("close", this.handleDisconnected.bind(this));
        this.websocket.addListener("message", this.handleMessage.bind(this));
    }

    private handleConnected() {
        console.log(`[RoomServerClient:${this.port}] Connected to the room server!`);
    }
    
    private async handleMessage(data: RawData) {
        this.eventHandler.decodeAndDispatchMessages(this.server, data);
    }

    private handleDisconnected() {
        console.log(`[RoomServerClient:${this.port}] Lost connection with the room server.`);
    }
    
    public sendProtobuff<Message extends UnknownMessage = UnknownMessage>(message: MessageType, payload: Message) {
        try {
            const encoded = message.encode(payload).finish();

            this.sendEncodedProtobuff(message.$type, encoded);
        }
        catch(error) {
            console.error("Failed to send Protobuff", error);
        }
    }
    
    private sendEncodedProtobuff(eventType: string, encoded: Uint8Array) {
        try {
            const typeBytes = new TextEncoder().encode(eventType + "|");

            const message = new Uint8Array(typeBytes.length + encoded.length);

            message.set(typeBytes, 0);
            message.set(encoded, typeBytes.length);

            this.websocket.send(message);
        }
        catch(error) {
            console.error("Failed to send encoded Protobuff", error);
        }
    }
}
