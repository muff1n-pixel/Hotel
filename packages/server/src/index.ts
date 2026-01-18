import { WebSocketServer } from "ws";
import { eventHandler } from "./Events/EventHandler.js";
import UserClient from "./Clients/UserClient.js";
import { UserModel } from "./Database/Models/Users/UserModel.js";
import { UserDataUpdated } from "@shared/WebSocket/Events/User/UserDataUpdated.js";
import OutgoingEvent from "./Events/Interfaces/OutgoingEvent.js";

import "./Rooms/Events/EnterRoom.js";
import "./Users/Events/RequestUserData.js";
import "./Users/Inventory/Events/RequestUserFurnitureData.js";

import ShopEvents from "./Shop/ShopEvents.js";
import { initializeModels } from "./Database/Database.js";
import { initializeDevelopmentData } from "./Database/Development/DatabaseDevelopmentData.js";

await initializeModels();
await initializeDevelopmentData();

eventHandler.addListener("ClientPingEvent", (userClient: UserClient) => {
	userClient.send(new OutgoingEvent<UserDataUpdated>("UserDataUpdated", {
        id: userClient.user.id,
		name: userClient.user.name,
		figureConfiguration: userClient.user.figureConfiguration
	}));
});

eventHandler.addListener("ShopPagesRequest", ShopEvents.dispatchShopPages);
eventHandler.addListener("ShopPageFurnitureRequest", ShopEvents.dispatchShopPageFurniture);
eventHandler.addListener("PurchaseShopFurnitureRequest", ShopEvents.handlePurchaseShopFurniture);

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

    const user = await UserModel.findByPk(userId);

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
