import { EventEmitter } from "node:events";
import type User from "../Users/User.js";
import type { RawData } from "ws";
import IncomingEvent from "../Communication/Interfaces/IncomingEvent.js";
import GetShopPagesEvent from "../Communication/Game/Shop/GetShopPagesEvent.js";
import GetShopPageFurnitureEvent from "../Communication/Game/Shop/GetShopPageFurnitureEvent.js";
import PurchaseShopFurnitureEvent from "../Communication/Game/Shop/PurchaseShopFurnitureEvent.js";
import EnterRoomEvent from "../Communication/Game/Rooms/EnterRoomEvent.js";
import GetUserEvent from "../Communication/Game/Users/GetUserEvent.js";
import GetUserFurnitureEvent from "../Communication/Game/Inventory/GetUserFurnitureEvent.js";
import PlaceFurnitureEvent from "../Communication/Game/Rooms/Furniture/PlaceFurnitureEvent.js";
import StartWalkingEvent from "../Communication/Game/Rooms/User/StartWalkingEvent.js";
import CreateRoomEvent from "../Communication/Game/Navigator/CreateRoomEvent.js";
import GetNavigatorRoomsEvent from "../Communication/Game/Navigator/GetNavigatorRoomsEvent.js";
import EnterHomeRoomEvent from "../Communication/Game/Rooms/EnterHomeRoomEvent.js";
import LeaveRoomEvent from "../Communication/Game/Rooms/LeaveRoomEvent.js";
import UpdateRoomFurnitureEvent from "../Communication/Game/Rooms/Furniture/UpdateRoomFurnitureEvent.js";
import PickupRoomFurnitureEvent from "../Communication/Game/Rooms/Furniture/PickupRoomFurnitureEvent.js";
import UseRoomFurnitureEvent from "../Communication/Game/Rooms/Furniture/UseRoomFurnitureEvent.js";
import PlaceRoomContentFurnitureEvent from "../Communication/Game/Rooms/Furniture/PlaceRoomContentFurnitureEvent.js";
import SendUserMessageEvent from "../Communication/Game/Rooms/User/SendUserMessageEvent.js";
import GetRoomChatStylesEvent from "../Communication/Game/Rooms/Chat/Styles/GetRoomChatStylesEvent.js";
import SetRoomChatStyleEvent from "../Communication/Game/Users/SetRoomChatStyleEvent.js";
import SetFigureConfigurationEvent from "../Communication/Game/Users/SetFigureConfigurationEvent.js";
import SetFurnitureDataEvent from "../Communication/Game/Rooms/Furniture/SetFurnitureDataEvent.js";
import UpdateRoomStructureEvent from "../Communication/Game/Rooms/UpdateRoomStructureEvent.js";
import UpdateRoomInformationEvent from "../Communication/Game/Rooms/UpdateRoomInformationEvent.js";
import SetHomeRoomEvent from "../Communication/Game/Users/SetHomeRoomEvent.js";
import UpdateUserRightsEvent from "../Communication/Game/Rooms/User/UpdateUserRightsEvent.js";
import GetHotelFeedbackEvent from "../Communication/Game/Hotel/GetHotelFeedbackEvent.js";
import SendFeedbackEvent from "../Communication/Game/Hotel/SendFeedbackEvent.js";
import PingEvent from "../Communication/Game/Users/PingEvent.js";
import GetRoomCategoriesEvent from "../Communication/Game/Navigator/GetRoomCategoriesEvent.js";
import GetInventoryBadgesEvent from "../Communication/Game/Inventory/GetInventoryBadgesEvent.js";
import UpdateUserBadgeEvent from "../Communication/Game/Inventory/UpdateUserBadgeEvent.js";
import GetUserProfileEvent from "../Communication/Game/Rooms/User/GetUserProfileEvent.js";
import SetMottoEvent from "../Communication/Game/Users/SetMottoEvent.js";
import UpdateShopPageEvent from "../Communication/Game/Shop/Development/UpdateShopPageEvent.js";
import UpdateShopFurnitureEvent from "../Communication/Game/Shop/Development/UpdateShopFurnitureEvent.js";
import ImportRoomFurnitureEvent from "../Communication/Game/Rooms/Furniture/Development/ImportRoomFurnitureEvent.js";
import GetRoomMapsEvent from "../Communication/Game/Navigator/GetRoomMapsEvent.js";
import UpdateRoomFloorplanEvent from "../Communication/Game/Rooms/Floorplan/UpdateRoomFloorplanEvent.js";
import GetFurnitureTypesEvent from "../Communication/Game/Furniture/GetFurnitureTypesEvent.js";
import UpdateFurnitureEvent from "../Communication/Game/Furniture/UpdateFurnitureEvent.js";
import SetTypingEvent from "../Communication/Game/Rooms/User/SetTypingEvent.js";
import GetShopPageBotsEvent from "../Communication/Game/Shop/GetShopPageBotsEvent.js";
import UpdateShopBotEvent from "../Communication/Game/Shop/Development/UpdateShopBotEvent.js";
import PurchaseShopBotEvent from "../Communication/Game/Shop/PurchaseShopBotEvent.js";
import GetUserBotsEvent from "../Communication/Game/Inventory/GetUserBotsEvent.js";
import PlaceBotEvent from "../Communication/Game/Rooms/Bots/PlaceBotEvent.js";
import PickupRoomBotEvent from "../Communication/Game/Rooms/Bots/PickupRoomBotEvent.js";

export default class EventHandler extends EventEmitter {
    constructor() {
        super();

        this.registerIncomingEvents();
    }

    public decodeAndDispatchMessages(user: User, rawData: RawData) {
        const payload = JSON.parse(rawData.toString());

        if(typeof payload !== "object") {
            throw new Error("Received payload is not an object.");
        }

        if(!Array.isArray(payload)) {
            throw new Error("Received payload is not an array.");
        }

        for(let event of payload) {
            const [ eventName, eventBody ] = event;

            console.log("Processing event: " + eventName);

            this.emit(eventName, user, eventBody);

            // TODO: remove the user event handler?
            user.emit(eventName, user, eventBody);
        }
    }

    addIncomingEvent<T>(incomingEvent: IncomingEvent<T>): this {
        return super.addListener(incomingEvent.name, async (user, event) => {
            try {
                await incomingEvent.handle(user, event);
            }
            catch(error) {
                console.error(error);
            }
        });
    }

    registerIncomingEvents() {
        this
            .addIncomingEvent(new GetShopPagesEvent())
            .addIncomingEvent(new GetShopPageFurnitureEvent())
            .addIncomingEvent(new GetShopPageBotsEvent())
            .addIncomingEvent(new PurchaseShopFurnitureEvent())
            .addIncomingEvent(new PurchaseShopBotEvent());
            
        this
            .addIncomingEvent(new EnterRoomEvent())
            .addIncomingEvent(new EnterHomeRoomEvent())
            .addIncomingEvent(new LeaveRoomEvent())
            .addIncomingEvent(new PlaceFurnitureEvent())
            .addIncomingEvent(new PlaceBotEvent())
            .addIncomingEvent(new PlaceRoomContentFurnitureEvent())
            .addIncomingEvent(new UseRoomFurnitureEvent())
            .addIncomingEvent(new UpdateRoomFurnitureEvent())
            .addIncomingEvent(new PickupRoomFurnitureEvent())
            .addIncomingEvent(new PickupRoomBotEvent())
            .addIncomingEvent(new StartWalkingEvent())
            .addIncomingEvent(new SendUserMessageEvent())
            .addIncomingEvent(new GetRoomChatStylesEvent())
            .addIncomingEvent(new SetFurnitureDataEvent())
            .addIncomingEvent(new UpdateRoomStructureEvent())
            .addIncomingEvent(new UpdateRoomInformationEvent())
            .addIncomingEvent(new UpdateUserRightsEvent());
            
        this
            .addIncomingEvent(new GetUserEvent())
            .addIncomingEvent(new GetUserFurnitureEvent())
            .addIncomingEvent(new GetUserBotsEvent())
            .addIncomingEvent(new GetUserProfileEvent())
            .addIncomingEvent(new GetInventoryBadgesEvent())
            .addIncomingEvent(new UpdateUserBadgeEvent())
            .addIncomingEvent(new SetRoomChatStyleEvent())
            .addIncomingEvent(new SetFigureConfigurationEvent())
            .addIncomingEvent(new SetHomeRoomEvent())
            .addIncomingEvent(new SetTypingEvent());
            
        this
            .addIncomingEvent(new CreateRoomEvent())
            .addIncomingEvent(new GetRoomMapsEvent())
            .addIncomingEvent(new GetNavigatorRoomsEvent())
            .addIncomingEvent(new GetRoomCategoriesEvent());
            
        this
            .addIncomingEvent(new SendFeedbackEvent())
            .addIncomingEvent(new GetHotelFeedbackEvent());

        this
            .addIncomingEvent(new UpdateShopPageEvent())
            .addIncomingEvent(new UpdateShopFurnitureEvent())
            .addIncomingEvent(new UpdateShopBotEvent());

        this
            .addIncomingEvent(new SetMottoEvent());

        this
            .addIncomingEvent(new ImportRoomFurnitureEvent());

        this
            .addIncomingEvent(new UpdateRoomFloorplanEvent());

        this.addIncomingEvent(new GetFurnitureTypesEvent());
        this.addIncomingEvent(new UpdateFurnitureEvent());

        this.addIncomingEvent(new PingEvent());
    }
}
