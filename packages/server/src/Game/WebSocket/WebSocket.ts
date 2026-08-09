import WebSocketConnection, { WebSocketServer } from "ws";
import { UserModel } from "../../Database/Models/Users/UserModel.js";
import { game } from "../index.js";
import User from "../Users/User.js";
import { config } from "../Config/Config.js";
import jsonWebToken from "jsonwebtoken";
import { UserTokenModel } from "../../Database/Models/Users/UserTokens/UserTokenModel.js";
import { UserBadgeModel } from "../../Database/Models/Users/Badges/UserBadgeModel.js";
import { randomBytes, randomUUID } from "node:crypto";
import { MessageType, UnknownMessage, UserReadyData } from "@pixel63/events";
import { logger } from "../GameLogger.js";

export type PendingConnection = {
    user: UserModel;
    websocket: WebSocketConnection;
    url: URL;
};

export default class WebSocket {
    private readonly server: WebSocketServer;

    public ready: boolean = false;

    private readonly pendingConnections: PendingConnection[] = [];

    constructor() {
        console.log("Starting on port " + config.port);
        
        this.server = new WebSocketServer({
            host: config.hostname,
            port: config.port ?? 7632
        });

        this.server.on("connection", (webSocket, request) => {
            (async () => {
                if(!this.ready) {
                    webSocket.close();

                    return;
                }
                
                if(!request.url) {
                    console.warn("No url provided.");

                    return webSocket.close();
                }

                const url = new URL(request.url, "http://localhost");

                let model: UserModel | null;

                if(config.authentication.useAccessTokens) {
                    const accessToken = url.searchParams.get("accessToken");

                    if(!accessToken) {
                        console.warn("No access token provided.");

                        return webSocket.close();
                    }

                    let token = await UserTokenModel.findOne();

                    if (!token) {
                        token = await UserTokenModel.create({
                            id: randomUUID(),
                            secretKey: randomBytes(32).toString("hex")
                        });
                    }

                    try {
                        const payload = jsonWebToken.verify(accessToken, token.secretKey);

                        if(typeof payload === "string") {
                            throw new Error("Payload is a string.");
                        }

                        model = await UserModel.findByPk(payload.userId);
                    }
                    catch(error) {
                        console.warn("Invalid access token provided.", error);

                        return webSocket.close();
                    }
                }
                else {
                    const userId = url.searchParams.get("userId");

                    if(!userId) {
                        console.warn("No user id provided.");

                        return webSocket.close();
                    }

                    model = await UserModel.findByPk(userId);
                }

                if(!model) {
                    console.warn("User does not exist.");

                    return webSocket.close();
                }

                const existingUser = game.users.find((user) => user.model.id === model.id);

                if(existingUser) {
                    console.warn("User " + model.name + " is already connected, disconnecting existing user.");

                    existingUser.disconnect();
                }

                const existingPendingConnection = this.pendingConnections.find((pendingConnection) => pendingConnection.user.id === model.id);

                if(existingPendingConnection) {
                    console.warn("User " + model.name + " is already connecting, disconnecting pending connection.");

                    existingPendingConnection.websocket.close();

                    const index = this.pendingConnections.indexOf(existingPendingConnection);

                    if(index !== -1) {
                        this.pendingConnections.slice(index, 1);
                    }
                }

                logger.verbose("Waiting for user " + model.name + " to send ready message.");

                const pendingConnection: PendingConnection = {
                    user: model,
                    websocket: webSocket,
                    url
                };

                this.pendingConnections.push(pendingConnection);

                webSocket.addListener("message", (data) => this.handleMessageListener(pendingConnection, data));

                webSocket.addListener("error", console.error);
                
                webSocket.addListener("close", () => {
                    (async () => {
                        console.log("User " + model.name + " disconnected before estabilishing connection.");

                        const index = this.pendingConnections.indexOf(pendingConnection);
                        
                        if(index !== -1) {
                            this.pendingConnections.slice(index, 1);
                        }
                    })().catch(console.error);
                });

                this.sendProtobuff(webSocket, UserReadyData, UserReadyData.create({}));
            })().catch(console.error);
        });
    }

    private handleMessageListener = this.handleMessage.bind(this);
    private handleMessage(pendingConnection: PendingConnection, data: WebSocketConnection.RawData) {
        try {
            let buffer: Buffer;

            if (typeof data === "string") {
                buffer = Buffer.from(data);
            } else if (data instanceof Buffer) {
                buffer = data;
            } else if (data instanceof ArrayBuffer) {
                buffer = Buffer.from(data);
            } else if (Array.isArray(data)) {
                buffer = Buffer.concat(data);
            } else {
                throw new Error("Unsupported RawData type");
            }

            const sep = buffer.indexOf("|".charCodeAt(0));
            const type = buffer.subarray(0, sep).toString("utf-8");
            const payload = buffer.subarray(sep + 1);

            if(type === UserReadyData.$type) {
                this.handleUserReady(pendingConnection);
            }
        }
        catch(error) {
            console.error("Failed to process Protobuff", error);
        }
    }

    private async handleUserReady(pendingConnection: PendingConnection) {
        pendingConnection.websocket.removeAllListeners();

        const user = new User(pendingConnection.websocket, pendingConnection.user);

        pendingConnection.websocket.addListener("message", (rawData) => {
            game.eventHandler.decodeAndDispatchMessages(user, rawData);
        });

        pendingConnection.websocket.addListener("close", () => {
            (async () => {
                if(user.room) {
                    user.room.disconnect();
                }

                console.log("User " + user.model.name + " disconnected.");

                const index = game.users.indexOf(user);
                
                if(index !== -1) {
                    game.users.splice(index, 1);
                }

                user.emit("close", user);

                await user.model.update({
                    online: false
                });

                await game.hotelInformation.updateUsersCount();

                user.friends.updateFriends();
            })().catch(console.error);
        });

        await pendingConnection.user.update({
            online: true,
            lastLogin: new Date()
        });

        await user.friends.loadFriends();

        const index = this.pendingConnections.indexOf(pendingConnection);
        
        if(index !== -1) {
            this.pendingConnections.slice(index, 1);
        }

        game.users.push(user);

        console.log("User " + user.model.name + " connected.");

        user.friends.updateFriends();

        if(pendingConnection.url.searchParams.has("roomId")) {
            const roomId = pendingConnection.url.searchParams.get("roomId")!;

            const room = await game.roomWorkerPool.getOrCreateRoom(roomId);

            room.worker.addUserToRoom(user, roomId);
        }
        else if(user.model.homeRoomId) {
            const room = await game.roomWorkerPool.getOrCreateRoom(user.model.homeRoomId);

            room.worker.addUserToRoom(user, user.model.homeRoomId);
        }

        const userBadgesCount = await UserBadgeModel.count({
            where: {
                userId: user.model.id
            }
        });

        const defaultBadges = ["CCF01", "CCF04", "CCF13", "CCF16", "CCF17", "CCF18", "CCF19", "CCF20", "CCF21", "CCF22", "CCF23", "CCF25"];

        if(!userBadgesCount) {
            await UserBadgeModel.bulkCreate(defaultBadges.map((badgeId) => {
                return {
                    id: randomUUID(),
                    userId: user.model.id,
                    badgeId,
                    equipped: false
                };
            }));
        }
        
        if(userBadgesCount === 0 || userBadgesCount === defaultBadges.length) {
            await UserBadgeModel.bulkCreate(["PX63B", "PX631", "PX632", "PX633", "PX634"].map((badgeId) => {
                return {
                    id: randomUUID(),
                    userId: user.model.id,
                    badgeId,
                    equipped: false
                };
            }));
        }

        await game.hotelInformation.updateUsersCount();

        const daysSinceRegistration = Math.floor((new Date().getTime() - user.model.createdAt.getTime()) / 86400000);

        await user.achievements.addTotalAchievementScore("TrueHabbo", daysSinceRegistration);

        await user.habboClub.redeemCashback();
        await user.resetScratches();

        user.sendProtobuff(UserReadyData, UserReadyData.create({}));
    }
    
    public sendProtobuff<Message extends UnknownMessage = UnknownMessage>(websocket: WebSocketConnection, message: MessageType, payload: Message) {
        try {
            const encoded = message.encode(payload).finish();

            this.sendEncodedProtobuff(websocket, message.$type, encoded);
        }
        catch(error) {
            console.error("Failed to send Protobuff", error);
        }
    }

    sendEncodedProtobuff(websocket: WebSocketConnection, eventType: string, encoded: Uint8Array) {
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
}