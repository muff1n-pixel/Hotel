import WebSocket, { RawData, WebSocketServer } from "ws";
import { config } from "../../Game/Config/Config";
import { IncomingMessage } from "http";
import jsonWebToken from "jsonwebtoken";
import { MessageType, ServerReadyData, UnknownMessage } from "@pixel63/events";
import { ServerTokenModel } from "../../Database/Models/Server/ServerTokenModel";
import EventHandler from "../../Communication/EventHandler";
import User from "../Users/User";
import { UserTokenModel } from "../../Database/Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../Database/Models/Users/UserModel";
import RoomServer from "../RoomServer";
import { logger } from "../RoomLogger";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import UserPermissions from "../../Game/Users/Permissions/UserPermissions";

export default class RoomWebSocket {
    private readonly server: WebSocketServer;
    private gameServerWebSocket?: WebSocket;

    public serverEventHandler = new EventHandler((_: unknown, type: string) => logger.verbose(`Received server message ${type}`));
    public userEventHandler = new EventHandler((user: User, type: string) => logger.verbose(`Received user message from ${user.model.name}: ${type}`));

    constructor() {
        const args = yargs(hideBin(process.argv))
            .option("port", {
                type: "number",
                default: 8081
            })
            .option("hostname", {
                type: "string",
                default: "localhost"
            })
            .parseSync();

        this.server = new WebSocketServer({
            host: args.hostname,
            port: args.port
        });

        this.server.addListener("connection", this.handleConnection.bind(this));

        logger.verbose(`Listening to websocket connections on port ${args.port}.`);
    }

    private async handleConnection(websocket: WebSocket, incomingMessage: IncomingMessage) {
        if (!incomingMessage.url) {
            logger.warn("Refusing connection from websocket, incoming message does not contain a URL.");

            websocket.close();

            return;
        }

        const url = new URL(incomingMessage.url, "http://localhost");

        const accessToken = url.searchParams.get("accessToken");

        if (!accessToken) {
            logger.warn("Refusing connection from websocket, incoming message does not contain an access token.");

            websocket.close();

            return;
        }

        if (url.searchParams.get("type") === "server") {
            await this.handleServerConnection(websocket, incomingMessage, accessToken, url);
        }
        else {
            this.handleUserConnection(websocket, incomingMessage, accessToken, url);
        }
    }

    private async handleServerConnection(websocket: WebSocket, request: IncomingMessage, accessToken: string, url: URL) {
        const serverToken = await ServerTokenModel.findOne();

        if (!serverToken) {
            logger.error("Refusing connection from websocket, server token does not exist in database!");

            websocket.close();

            return;
        }

        const payload = this.getAccessTokenPayload(accessToken, serverToken.secretKey);

        if (!payload) {
            logger.warn("Refusing connection from websocket, server access token is invalid.");

            websocket.close();

            return;
        }

        this.gameServerWebSocket = websocket;

        logger.info("Room server is connected with the game server.");

        websocket.addListener("message", this.handleServerMessage.bind(this));

        this.sendProtobuff(websocket, ServerReadyData, ServerReadyData.create({}));
    }

    private async handleServerMessage(data: RawData) {
        this.serverEventHandler.decodeAndDispatchMessages(null, data);
    }

    private async handleUserConnection(websocket: WebSocket, request: IncomingMessage, accessToken: string, url: URL) {
        const userToken = await UserTokenModel.findOne();

        if (!userToken) {
            logger.error("Refusing connection from websocket, user token does not exist in database!");

            websocket.close();

            return;
        }

        const payload = this.getAccessTokenPayload(accessToken, userToken.secretKey);

        if (!payload) {
            logger.warn("Refusing connection from websocket, user access token is invalid.");

            websocket.close();

            return;
        }

        const model = await UserModel.findByPk(payload.userId);

        if (!model) {
            logger.warn("Refusing connection from websocket, user does not exist in database.", {
                userId: payload.userId
            });

            websocket.close();

            return;
        }

        const existingUser = RoomServer.users.find((user) => user.model.id === model.id);

        if(existingUser) {
            logger.warn("User is already connected to server, disconnecting existing user and rejecting incoming connection.");

            existingUser.disconnect();

            websocket.close();

            return;
        }

        const roomId = url.searchParams.get("roomId");

        if (!roomId) {
            logger.warn("Refusing connection from websocket, incoming message does not contain a room id.", {
                userId: payload.userId
            });

            websocket.close();

            return;
        }

        const pendingUser = RoomServer.pendingUsers.find((pendingUser) => pendingUser.userId === model.id);

        if(!pendingUser) {
            logger.warn("Refusing connection from websocket, user does not have a pending connection.", {
                userId: payload.userId
            });

            websocket.close();

            return;
        }

        const pendingUserIndex = RoomServer.pendingUsers.indexOf(pendingUser);

        if(pendingUserIndex !== -1) {
            RoomServer.pendingUsers.splice(pendingUserIndex, 1);
        }

        if(pendingUser.roomId !== roomId) {
            logger.warn("Refusing connection from websocket, user is not requesting the correct room id.", {
                userId: payload.userId
            });

            websocket.close();

            return;
        }

        logger.info(`Connected with user ${model.name} for room id ${roomId}.`);

        const room = RoomServer.roomManager.getRoomInstance(roomId);

        if (!room) {
            logger.warn("Refusing connection from websocket, requested room is not loaded.", {
                userId: payload.userId
            });

            websocket.close();

            return;
        }

        const permissions = new UserPermissions(model);

        permissions.loadPermissions().then(() => {
            const user: User = new User(websocket, model, room, permissions);

            RoomServer.users.push(user);

            if(pendingUser.userFurnitureId) {
                const userFurniture = room.furnitures.find((userFurniture) => userFurniture.model.id === pendingUser.userFurnitureId);

                if(userFurniture) {
                    userFurniture.logic?.handleUserEntersRoomWithFurniture?.(user.roomUser);
                }
            }

            websocket.addListener("message", this.handleUserMessage.bind(this, user));
            websocket.addListener("close", this.handleUserDisconnected.bind(this, user));
        });
    }

    private async handleUserMessage(user: User, data: RawData) {
        this.userEventHandler.decodeAndDispatchMessages(user, data);
    }

    private async handleUserDisconnected(user: User, data: RawData) {
        logger.info(`User ${user.model.name} disconnected.`);

        const index = RoomServer.users.indexOf(user);

        if(index !== -1) {
            RoomServer.users.splice(index, 1);
        }
    }

    public sendServerProtobuff<Message extends UnknownMessage = UnknownMessage>(message: MessageType, payload: Message) {
        return this.sendProtobuff(this.gameServerWebSocket!, message, payload);
    }

    public sendProtobuff<Message extends UnknownMessage = UnknownMessage>(websocket: WebSocket, message: MessageType, payload: Message) {
        try {
            const encoded = message.encode(payload).finish();

            this.sendEncodedProtobuff(websocket, message.$type, encoded);
        }
        catch (error) {
            logger.error("Failed to encode Protobuff message.", {
                message,
                payload,
                error
            });
        }
    }

    public sendEncodedProtobuff(websocket: WebSocket, eventType: string, encoded: Uint8Array) {
        try {
            const typeBytes = new TextEncoder().encode(eventType + "|");

            const message = new Uint8Array(typeBytes.length + encoded.length);

            message.set(typeBytes, 0);
            message.set(encoded, typeBytes.length);

            websocket.send(message);
        }
        catch (error) {
            logger.error("Failed to send encoded Protobuff message.", {
                eventType,
                encoded,
                error
            });
        }
    }

    private getAccessTokenPayload<T>(accessToken: string, secretKey: string) {
        try {
            const payload = jsonWebToken.verify(accessToken, secretKey);

            if (typeof payload === "string") {
                throw new Error("Payload is a string.");
            }

            return payload;
        }
        catch (error) {
            logger.error("Failed to verify JWT", error);

            return null;
        }
    }
}
