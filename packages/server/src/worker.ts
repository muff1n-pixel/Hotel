import { isMainThread, parentPort, workerData } from "worker_threads";
import ProtobuffMessaging from "./Communication/ProtobuffMessaging.js";
import { RoomWorkerLoadData, RoomWorkerLoadedData } from "@pixel63/events";
import Room from "./Rooms/Room.js";
import { RoomModel } from "./Database/Models/Rooms/RoomModel.js";
import { RoomCategoryModel } from "./Database/Models/Rooms/Categories/RoomCategoryModel.js";
import { UserModel } from "./Database/Models/Users/UserModel.js";
import { RoomRightsModel } from "./Database/Models/Rooms/Rights/RoomRightsModel.js";
import { UserFurnitureModel } from "./Database/Models/Users/Furniture/UserFurnitureModel.js";
import { FurnitureModel } from "./Database/Models/Furniture/FurnitureModel.js";
import { UserBotModel } from "./Database/Models/Users/Bots/UserBotModel.js";

if(isMainThread) {
    throw new Error("Room worker was initialized on the main thread.");
}

if(!parentPort) {
    throw new Error("Parent port is not available in the worker thread.");
}

const rooms: Room[] = [];

const messaging = new ProtobuffMessaging((message) => parentPort?.postMessage(message));

parentPort.addListener("message", (event) => {
    messaging.handleProtobuffMessage(event);
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
