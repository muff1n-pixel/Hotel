import { WebSocketServer } from "ws";
import { eventHandler } from "./Events/EventHandler.js";
import User from "./Users/User.js";
import { UserModel } from "./Database/Models/Users/UserModel.js";
import { initializeModels } from "./Database/Database.js";
import { initializeDevelopmentData } from "./Database/Development/DatabaseDevelopmentData.js";
import Game from "./Game.js";
import GetShopPagesEvent from "./Communication/Game/Shop/GetShopPagesEvent.js";
import GetShopPageFurnitureEvent from "./Communication/Game/Shop/GetShopPageFurnitureEvent.js";
import PurchaseShopFurnitureEvent from "./Communication/Game/Shop/PurchaseShopFurnitureEvent.js";
import EnterRoomEvent from "./Communication/Game/Rooms/EnterRoomEvent.js";
import GetUserEvent from "./Communication/Game/Users/GetUserEvent.js";
import GetUserFurnitureEvent from "./Communication/Game/Inventory/GetUserFurnitureEvent.js";
import PlaceFurnitureEvent from "./Communication/Game/Rooms/Furniture/PlaceFurnitureEvent.js";
import StartWalkingEvent from "./Communication/Game/Rooms/User/StartWalkingEvent.js";
import CreateRoomEvent from "./Communication/Game/Navigator/CreateRoomEvent.js";
import GetNavigatorRoomsEvent from "./Communication/Game/Navigator/GetNavigatorRoomsEvent.js";
import EnterHomeRoomEvent from "./Communication/Game/Rooms/EnterHomeRoomEvent.js";
import LeaveRoomEvent from "./Communication/Game/Rooms/LeaveRoomEvent.js";
import UpdateRoomFurnitureEvent from "./Communication/Game/Rooms/Furniture/UpdateRoomFurnitureEvent.js";
import PickupRoomFurnitureEvent from "./Communication/Game/Rooms/Furniture/PickupRoomFurnitureEvent.js";

await initializeModels();
await initializeDevelopmentData();

// TODO: clean up event handler types
eventHandler
    .addIncomingEvent("GetShopPagesEvent", new GetShopPagesEvent())
    .addIncomingEvent("GetShopPageFurnitureEvent", new GetShopPageFurnitureEvent())
    .addIncomingEvent("PurchaseShopFurnitureEvent", new PurchaseShopFurnitureEvent());
    
eventHandler
    .addIncomingEvent("EnterRoomEvent", new EnterRoomEvent())
    .addIncomingEvent("EnterHomeRoomEvent", new EnterHomeRoomEvent())
    .addIncomingEvent("LeaveRoomEvent", new LeaveRoomEvent())
    .addIncomingEvent("PlaceFurnitureEvent", new PlaceFurnitureEvent())
    .addIncomingEvent("UpdateRoomFurnitureEvent", new UpdateRoomFurnitureEvent())
    .addIncomingEvent("PickupRoomFurnitureEvent", new PickupRoomFurnitureEvent())
    .addIncomingEvent("StartWalkingEvent", new StartWalkingEvent());
    
eventHandler
    .addIncomingEvent("GetUserEvent", new GetUserEvent())
    .addIncomingEvent("GetUserFurnitureEvent", new GetUserFurnitureEvent());
    
eventHandler
    .addIncomingEvent("CreateRoomEvent", new CreateRoomEvent())
    .addIncomingEvent("GetNavigatorRoomsEvent", new GetNavigatorRoomsEvent());

export const game = new Game();

await game.loadModels();

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

    const model = await UserModel.findByPk(userId);

    if(!model) {
		console.warn("User does not exist.");

        return webSocket.close();
    }

    const user = new User(webSocket, model);

    webSocket.on("error", console.error);

    webSocket.on("message", (rawData) => {
        eventHandler.decodeAndDispatchMessages(user, rawData);
    });

    webSocket.on("close", () => {
        user.emit("close", user);
    });
});
