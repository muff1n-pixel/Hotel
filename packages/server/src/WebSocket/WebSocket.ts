import { WebSocketServer } from "ws";
import { UserModel } from "../Database/Models/Users/UserModel.js";
import { game } from "../index.js";
import { eventHandler } from "../Events/EventHandler.js";
import User from "../Users/User.js";

export default class WebSocket {
    private readonly server: WebSocketServer;

    constructor() {
        this.server = new WebSocketServer({
            port: 7632
        });

        this.server.on("connection", async (webSocket, request) => {
            if(!request.url) {
                console.warn("No url provided.");

                return webSocket.close();
            }

            const url = new URL(request.url, "http://localhost");

            const userId = url.searchParams.get("userId");

            if(!userId) {
                console.warn("No user id provided.");

                return webSocket.close();
            }

            const model = await UserModel.findByPk(userId);

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
        });
    }
}