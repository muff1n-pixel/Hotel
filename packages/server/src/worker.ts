import { isMainThread, parentPort, workerData } from "worker_threads";
import ProtobuffMessaging from "./Communication/ProtobuffMessaging.js";
import { RoomReadyData, RoomWorkerLoadData, RoomWorkerLoadedData, RoomWorkerUserMessageData } from "@pixel63/events";
import Room from "./Rooms/Room.js";
import { RoomModel } from "./Database/Models/Rooms/RoomModel.js";
import { RoomCategoryModel } from "./Database/Models/Rooms/Categories/RoomCategoryModel.js";
import { UserModel } from "./Database/Models/Users/UserModel.js";
import { RoomRightsModel } from "./Database/Models/Rooms/Rights/RoomRightsModel.js";
import { UserFurnitureModel } from "./Database/Models/Users/Furniture/UserFurnitureModel.js";
import { FurnitureModel } from "./Database/Models/Furniture/FurnitureModel.js";
import { UserBotModel } from "./Database/Models/Users/Bots/UserBotModel.js";
import RoomReadyEvent from "./Rooms/Worker/Events/RoomReadyEvent.js";

if(isMainThread) {
    throw new Error("Room worker was initialized on the main thread.");
}

if(!parentPort) {
    throw new Error("Parent port is not available in the worker thread.");
}

const rooms: Room[] = [];

const messaging = new ProtobuffMessaging((message) => parentPort?.postMessage(message));
const events = new ProtobuffMessaging((message) => parentPort?.postMessage(message));

events.addUserProtobuffListener(RoomReadyData, new RoomReadyEvent());
events.addUserProtobuffListener(RoomClickData, new RoomClickEvent());
events.addUserProtobuffListener(PlaceRoomFurnitureData, new PlaceFurnitureEvent())
events.addUserProtobuffListener(PlaceRoomBotData, new PlaceBotEvent())
events.addUserProtobuffListener(PlaceRoomContentFurnitureData, new PlaceRoomContentFurnitureEvent())
events.addUserProtobuffListener(UseRoomFurnitureData, new UseRoomFurnitureEvent())
events.addUserProtobuffListener(UpdateRoomFurnitureData, new UpdateRoomFurnitureEvent())
events.addUserProtobuffListener(UpdateRoomBotData, new UpdateRoomBotEvent())
events.addUserProtobuffListener(PickupRoomFurnitureData, new PickupRoomFurnitureEvent())
events.addUserProtobuffListener(PickupRoomBotData, new PickupRoomBotEvent())
events.addUserProtobuffListener(SendRoomUserWalkData, new StartWalkingEvent())
events.addUserProtobuffListener(SendRoomChatMessageData, new SendUserMessageEvent())
events.addUserProtobuffListener(GetRoomChatStylesData, new GetRoomChatStylesEvent())
events.addUserProtobuffListener(UpdateRoomStructureData, new UpdateRoomStructureEvent())
events.addUserProtobuffListener(UpdateRoomInformationData, new UpdateRoomInformationEvent())
events.addUserProtobuffListener(SetRoomUserRightsData, new UpdateUserRightsEvent())
events.addUserProtobuffListener(GetUserBadgesData, new GetUserBadgesEvent())
events.addUserProtobuffListener(SetRoomChatTypingData, new SetTypingEvent())
events.addUserProtobuffListener(GetUserBotSpeechData, new GetRoomBotSpeechEvent())
events.addUserProtobuffListener(RoomFurnitureImportData, new ImportRoomFurnitureEvent());

parentPort.addListener("message", (event) => {
    messaging.handleProtobuffMessage(event);
});

messaging.addProtobuffListener(RoomWorkerUserMessageData, async (payload: RoomWorkerUserMessageData) => {
    const room = rooms.find((room) => room.users.some((user) => user.id === payload.userId));

    if(!room) {
        return;
    }

    const user = room.users.find((user) => user.id === payload.userId);

    if(!user) {
        return;
    }

    events.handleUserProtobuffMessage(user, payload.message);
});

messaging.addProtobuffListener(RoomWorkerLoadData, async (payload: RoomWorkerLoadData) => {
    const room = await RoomModel.findByPk(payload.id, {
        include: [
            {
                model: RoomCategoryModel,
                as: "category"
            },
            {
                model: UserModel,
                as: "owner"
            },
            {
                model: RoomRightsModel,
                as: "rights",
                include: [
                    {
                        model: UserModel,
                        as: "user"
                    }
                ]
            },
            {
                model: UserFurnitureModel,
                as: "roomFurnitures",
                include: [
                    {
                        model: FurnitureModel,
                        as: "furniture"
                    },
                    {
                        model: UserModel,
                        as: "user"
                    }
                ]
            },
            {
                model: UserBotModel,
                as: "roomBots",
                include: [
                    {
                        model: UserModel,
                        as: "user"
                    }
                ]
            }
        ]
    });

    if(!room) {
        throw new Error("Room does not exist.");
    }

    rooms.push(new Room(room));

    messaging.sendProtobuff(RoomWorkerLoadedData, RoomWorkerLoadedData.create({
        roomId: room.id
    }));
});

parentPort.addEventListener("close", () => {
    console.log("Worker closed");
});
