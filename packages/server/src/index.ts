import { eventHandler } from "./Events/EventHandler.js";
import { initializeModels, recreateShop, resetDatabase } from "./Database/Database.js";
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
import UseRoomFurnitureEvent from "./Communication/Game/Rooms/Furniture/UseRoomFurnitureEvent.js";
import PlaceRoomContentFurnitureEvent from "./Communication/Game/Rooms/Furniture/PlaceRoomContentFurnitureEvent.js";
import SendUserMessageEvent from "./Communication/Game/Rooms/User/SendUserMessageEvent.js";
import GetRoomChatStylesEvent from "./Communication/Game/Rooms/Chat/Styles/GetRoomChatStylesEvent.js";
import SetRoomChatStyleEvent from "./Communication/Game/Users/SetRoomChatStyleEvent.js";
import SetFigureConfigurationEvent from "./Communication/Game/Users/SetFigureConfigurationEvent.js";
import SetRoomMoodlightEvent from "./Communication/Game/Rooms/Furniture/SetFurnitureDataEvent.js";
import SetFurnitureDataEvent from "./Communication/Game/Rooms/Furniture/SetFurnitureDataEvent.js";
import UpdateRoomStructureEvent from "./Communication/Game/Rooms/UpdateRoomStructureEvent.js";
import UpdateRoomInformationEvent from "./Communication/Game/Rooms/UpdateRoomInformationEvent.js";
import SetHomeRoomEvent from "./Communication/Game/Users/SetHomeRoomEvent.js";
import { recreateShopPages } from "./Database/Development/ShopDevelopmentData.js";
import UpdateUserRightsEvent from "./Communication/Game/Rooms/User/UpdateUserRightsEvent.js";
import GetHotelFeedbackEvent from "./Communication/Game/Hotel/GetHotelFeedbackEvent.js";
import SendFeedbackEvent from "./Communication/Game/Hotel/SendFeedbackEvent.js";
import { readFileSync } from "node:fs";
import PingEvent from "./Communication/Game/Users/PingEvent.js";

await initializeModels();

if(resetDatabase) {
    await initializeDevelopmentData();
}

if(recreateShop) {
    await recreateShopPages();
}

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
    .addIncomingEvent("PlaceRoomContentFurnitureEvent", new PlaceRoomContentFurnitureEvent())
    .addIncomingEvent("UseRoomFurnitureEvent", new UseRoomFurnitureEvent())
    .addIncomingEvent("UpdateRoomFurnitureEvent", new UpdateRoomFurnitureEvent())
    .addIncomingEvent("PickupRoomFurnitureEvent", new PickupRoomFurnitureEvent())
    .addIncomingEvent("StartWalkingEvent", new StartWalkingEvent())
    .addIncomingEvent("SendUserMessageEvent", new SendUserMessageEvent())
    .addIncomingEvent("GetRoomChatStylesEvent", new GetRoomChatStylesEvent())
    .addIncomingEvent("SetFurnitureDataEvent", new SetFurnitureDataEvent())
    .addIncomingEvent("UpdateRoomStructureEvent", new UpdateRoomStructureEvent())
    .addIncomingEvent("UpdateRoomInformationEvent", new UpdateRoomInformationEvent())
    .addIncomingEvent("UpdateUserRightsEvent", new UpdateUserRightsEvent());
    
eventHandler
    .addIncomingEvent("GetUserEvent", new GetUserEvent())
    .addIncomingEvent("GetUserFurnitureEvent", new GetUserFurnitureEvent())
    .addIncomingEvent("SetRoomChatStyleEvent", new SetRoomChatStyleEvent())
    .addIncomingEvent("SetFigureConfigurationEvent", new SetFigureConfigurationEvent())
    .addIncomingEvent("SetHomeRoomEvent", new SetHomeRoomEvent());
    
eventHandler
    .addIncomingEvent("CreateRoomEvent", new CreateRoomEvent())
    .addIncomingEvent("GetNavigatorRoomsEvent", new GetNavigatorRoomsEvent());
    
eventHandler
    .addIncomingEvent("SendFeedbackEvent", new SendFeedbackEvent())
    .addIncomingEvent("GetHotelFeedbackEvent", new GetHotelFeedbackEvent());

eventHandler.addIncomingEvent("Ping", new PingEvent());

export const game = new Game();

await game.loadModels();

console.log("Server started");
