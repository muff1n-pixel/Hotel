import { WebSocketServer } from "ws";
import { eventHandler } from "./Events/EventHandler.js";
import UserClient from "./Clients/UserClient.js";
import { User } from "./Database/Models/User.js";
import { UserDataUpdated } from "@shared/WebSocket/Events/User/UserDataUpdated.js";
import OutgoingEvent from "./Events/Interfaces/OutgoingEvent.js";

import "./Rooms/Events/EnterRoom.js";
import "./Users/Events/RequestUserData.js";

eventHandler.addListener("ClientPingEvent", (userClient: UserClient) => {
	userClient.send(new OutgoingEvent<UserDataUpdated>("UserDataUpdated", {
        id: userClient.user.id,
		name: userClient.user.name,
		figureConfiguration: userClient.user.figureConfiguration
	}));
});

const webSocketServer = new WebSocketServer({
    port: 7632
});

webSocketServer.on("connection", async (webSocket, request) => {
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

    const user = await User.findByPk(userId);

    if(!user) {
		console.warn("User does not exist.");

        return webSocket.close();
    }

    const userClient = new UserClient(webSocket, user);

    webSocket.on("error", console.error);

    webSocket.on("message", (rawData) => {
        eventHandler.decodeAndDispatchMessages(userClient, rawData);
    });

    webSocket.on("close", () => {
        userClient.emit("close", userClient);
    });
});
