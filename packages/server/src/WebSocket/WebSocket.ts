import { WebSocketServer } from "ws";
import { UserModel } from "../Database/Models/Users/UserModel.js";
import { game } from "../index.js";
import { eventHandler } from "../Events/EventHandler.js";
import User from "../Users/User.js";
import OutgoingEvent from "../Events/Interfaces/OutgoingEvent.js";
import { HotelEventData } from "@shared/Communications/Responses/Hotel/HotelEventData.js";
import { config } from "../Config/Config.js";
import jsonWebToken from "jsonwebtoken";
import { UserTokenModel } from "../Database/Models/Users/UserTokens/UserTokenModel.js";
import { UserBadgeModel } from "../Database/Models/Users/Badges/UserBadgeModel.js";
import { randomUUID } from "node:crypto";

export default class WebSocket {
    private readonly server: WebSocketServer;

    constructor() {
        this.server = new WebSocketServer({
            port: config.port ?? 7632
        });

        this.server.on("connection", async (webSocket, request) => {
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

                const token = await UserTokenModel.findOne();

                if(!token) {
                    throw new Error("There is no JSON Web Token secret key row.");
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
                console.warn("User is already connected.");

                existingUser.webSocket.close();
            }

            const user = new User(webSocket, model);

            game.users.push(user);

            webSocket.on("error", console.error);

            webSocket.on("message", (rawData) => {
                eventHandler.decodeAndDispatchMessages(user, rawData);
            });

            webSocket.on("close", () => {
                const index = game.users.indexOf(user);

                if(index !== -1) {
                    game.users.splice(index, 1);
                }

                user.emit("close", user);
            });

            if(user.model.homeRoomId) {
                const room = await game.roomManager.getOrLoadRoomInstance(user.model.homeRoomId);

                room?.addUserClient(user);
            }

            const userBadgesCount = await UserBadgeModel.count({
                where: {
                    userId: user.model.id
                }
            });

            if(!userBadgesCount) {
                await UserBadgeModel.bulkCreate(["CCF01", "CCF04", "CCF13", "CCF16", "CCF17", "CCF18", "CCF19", "CCF20", "CCF21", "CCF22", "CCF23", "CCF25"].map((badgeId) => {
                    return {
                        id: randomUUID(),
                        userId: user.model.id,
                        badgeId,
                        equipped: false
                    };
                }));
            }

            for(let user of game.users) {
                user.send(new OutgoingEvent<HotelEventData>("HotelEvent", {
                    users: game.users.length
                }));
            }
        });
    }
}