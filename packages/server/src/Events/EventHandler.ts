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
import CreateRoomEvent from "../Communication/Game/Navigator/CreateRoomEvent.js";
import GetNavigatorRoomsEvent from "../Communication/Game/Navigator/GetNavigatorRoomsEvent.js";
import LeaveRoomEvent from "../Communication/Game/Rooms/LeaveRoomEvent.js";
import SetRoomChatStyleEvent from "../Communication/Game/Users/SetRoomChatStyleEvent.js";
import SetFigureConfigurationEvent from "../Communication/Game/Users/SetFigureConfigurationEvent.js";
import SetHomeRoomEvent from "../Communication/Game/Users/SetHomeRoomEvent.js";
import GetHotelFeedbackEvent from "../Communication/Game/Hotel/GetHotelFeedbackEvent.js";
import SendHotelFeedbackEvent from "../Communication/Game/Hotel/SendHotelFeedbackEvent.js";
import PingEvent from "../Communication/Game/Users/PingEvent.js";
import GetRoomCategoriesEvent from "../Communication/Game/Navigator/GetRoomCategoriesEvent.js";
import GetInventoryBadgesEvent from "../Communication/Game/Inventory/GetInventoryBadgesEvent.js";
import UpdateUserBadgeEvent from "../Communication/Game/Inventory/UpdateUserBadgeEvent.js";
import SetMottoEvent from "../Communication/Game/Users/SetMottoEvent.js";
import UpdateShopPageEvent from "../Communication/Game/Shop/Development/UpdateShopPageEvent.js";
import UpdateShopFurnitureEvent from "../Communication/Game/Shop/Development/UpdateShopFurnitureEvent.js";
import GetRoomMapsEvent from "../Communication/Game/Navigator/GetRoomMapsEvent.js";
import GetFurnitureTypesEvent from "../Communication/Game/Furniture/GetFurnitureTypesEvent.js";
import UpdateFurnitureEvent from "../Communication/Game/Furniture/UpdateFurnitureEvent.js";
import GetShopPageBotsEvent from "../Communication/Game/Shop/GetShopPageBotsEvent.js";
import UpdateShopBotEvent from "../Communication/Game/Shop/Development/UpdateShopBotEvent.js";
import PurchaseShopBotEvent from "../Communication/Game/Shop/PurchaseShopBotEvent.js";
import GetUserBotsEvent from "../Communication/Game/Inventory/GetUserBotsEvent.js";
import { CreateRoomData, EnterRoomData, GetFurnitureTypesData, GetHotelFeedbackData, GetNavigatorData, GetRoomCategoriesData, GetRoomChatStylesData, GetRoomMapsData, GetShopPageBotsData, GetShopPageFurnitureData, GetShopPagesData, GetUserBadgesData, GetUserBotSpeechData, GetUserData, GetUserInventoryBadgesData, GetUserInventoryBotsData, GetUserInventoryFurnitureData, LeaveRoomData, MessageType, PickupRoomBotData, PickupRoomFurnitureData, PingData, PlaceRoomBotData, PlaceRoomContentFurnitureData, PlaceRoomFurnitureData, PurchaseShopBotData, PurchaseShopFurnitureData, RoomClickData, RoomFurnitureImportData, RoomReadyData, SendHotelFeedbackData, SendRoomChatMessageData, SendRoomUserWalkData, SetRoomChatTypingData, SetRoomUserRightsData, SetUserFigureConfigurationData, SetUserHomeRoomData, SetUserMottoData, SetUserRoomChatStyleData, UpdateFurnitureData, UpdateRoomBotData, UpdateRoomFurnitureData, UpdateRoomInformationData, UpdateRoomStructureData, UpdateShopBotData, UpdateShopFurnitureData, UpdateShopPageData, UpdateUserBadgeData, UseRoomFurnitureData } from "@pixel63/events";
import ProtobuffListener from "../Communication/Interfaces/ProtobuffListener.js";

export default class EventHandler extends EventEmitter {
    constructor() {
        super();

        this.registerIncomingEvents();
    }

    public decodeAndDispatchMessages(user: User, rawData: RawData) {
        try {
            let buffer: Buffer;

            if (typeof rawData === "string") {
                buffer = Buffer.from(rawData);
            } else if (rawData instanceof Buffer) {
                buffer = rawData;
            } else if (rawData instanceof ArrayBuffer) {
                buffer = Buffer.from(rawData);
            } else if (Array.isArray(rawData)) {
                buffer = Buffer.concat(rawData);
            } else {
                throw new Error("Unsupported RawData type");
            }

            const sep = buffer.indexOf("|".charCodeAt(0));
            const type = buffer.subarray(0, sep).toString("utf-8");
            const payload = buffer.subarray(sep + 1);

            console.log("Received " + type);

            this.emit(type, user, payload);

            // TODO: remove the user event handler?
            user.emit(type, user, payload);
        }
        catch(error) {
            console.error("Failed to process Protobuff", error);
        }
    }

    addProtobuffListener<T>(message: MessageType, protobuffListener: ProtobuffListener<T>) {
        super.addListener(message.$type, async (user, event) => {
            try {
                await protobuffListener.handle(user, message.decode(event) as T);
            }
            catch(error) {
                console.error("Failed to process event", error);
            }
        });

        return this;
    }

    removeProtobuffListener(message: MessageType, listener: (event: Uint8Array<ArrayBufferLike>) => void) {
        super.removeListener(message.$type, listener);
    }

    registerIncomingEvents() {
        // Hotel events
        this.addProtobuffListener(SendHotelFeedbackData, new SendHotelFeedbackEvent())

        // Furniture events
        this.addProtobuffListener(UpdateFurnitureData, new UpdateFurnitureEvent());

        // Room events
        this.addProtobuffListener(CreateRoomData, new CreateRoomEvent());

        // Shop events
        this.addProtobuffListener(GetShopPagesData, new GetShopPagesEvent());
        this.addProtobuffListener(GetShopPageFurnitureData, new GetShopPageFurnitureEvent());
        this.addProtobuffListener(GetShopPageBotsData, new GetShopPageBotsEvent());
        this.addProtobuffListener(PurchaseShopFurnitureData, new PurchaseShopFurnitureEvent());
        this.addProtobuffListener(PurchaseShopBotData, new PurchaseShopBotEvent());

        this
            .addProtobuffListener(EnterRoomData, new EnterRoomEvent())
            .addProtobuffListener(LeaveRoomData, new LeaveRoomEvent());
            
        this
            .addProtobuffListener(GetUserData, new GetUserEvent())
            .addProtobuffListener(GetUserInventoryFurnitureData, new GetUserFurnitureEvent())
            .addProtobuffListener(GetUserInventoryBotsData, new GetUserBotsEvent())
            .addProtobuffListener(GetUserInventoryBadgesData, new GetInventoryBadgesEvent())
            .addProtobuffListener(UpdateUserBadgeData, new UpdateUserBadgeEvent())
            .addProtobuffListener(SetUserRoomChatStyleData, new SetRoomChatStyleEvent())
            .addProtobuffListener(SetUserFigureConfigurationData, new SetFigureConfigurationEvent())
            .addProtobuffListener(SetUserHomeRoomData, new SetHomeRoomEvent())
            
        this
            .addProtobuffListener(GetRoomMapsData, new GetRoomMapsEvent())
            .addProtobuffListener(GetNavigatorData, new GetNavigatorRoomsEvent())
            .addProtobuffListener(GetRoomCategoriesData, new GetRoomCategoriesEvent());
            
        this.addProtobuffListener(GetHotelFeedbackData, new GetHotelFeedbackEvent());

        this
            .addProtobuffListener(UpdateShopPageData, new UpdateShopPageEvent())
            .addProtobuffListener(UpdateShopFurnitureData, new UpdateShopFurnitureEvent())
            .addProtobuffListener(UpdateShopBotData, new UpdateShopBotEvent());

        this.addProtobuffListener(SetUserMottoData, new SetMottoEvent());

        this.addProtobuffListener(GetFurnitureTypesData, new GetFurnitureTypesEvent());

        this.addProtobuffListener(PingData, new PingEvent());
    }
}
