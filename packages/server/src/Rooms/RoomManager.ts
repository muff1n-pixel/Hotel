import { FurnitureModel } from "../Database/Models/Furniture/FurnitureModel.js";
import { RoomModel } from "../Database/Models/Rooms/RoomModel.js";
import { UserFurnitureModel } from "../Database/Models/Users/Furniture/UserFurnitureModel.js";
import Room from "./Room.js";
import { UserModel } from "../Database/Models/Users/UserModel.js";
import { RoomRightsModel } from "../Database/Models/Rooms/Rights/RoomRightsModel.js";
import { RoomCategoryModel } from "../Database/Models/Rooms/Categories/RoomCategoryModel.js";
import { UserBotModel } from "../Database/Models/Users/Bots/UserBotModel.js";
import { Worker } from "worker_threads";
import { config } from "../Config/Config.js";
import { RoomWorkerMessage } from "../Workers/Interfaces/RoomWorkerMessage.js";
import User from "../Users/User.js";
import RoomWorker from "./Worker/RoomWorker.js";
import { RoomWorkerAddUserData, RoomWorkerLoadData, RoomWorkerLoadedData } from "@pixel63/events";


// TODO: do we really need the Room model in the functions or is it sufficient with a roomId?
export default class RoomManager {
    public instances: Room[] = [];

    public workers: RoomWorker[] = [];

    constructor() {
        const workersCount = Math.max(1, config.workers?.maximumRoomThreads ?? 2);

        for(let index = 0; index < workersCount; index++) {
            this.workers.push(new RoomWorker());
        }
    }

    public async addUserToRoom(user: User, roomId: string) {
        const worker = this.getWorkerWithRoom(roomId);

        const room = worker.getRoom(roomId);

        if(!room) {
            throw new Error("Failed to get room within worker.");
        }

        if(!room.loaded) {
            await this.waitForRoom(roomId);
        }

        worker.messaging.sendProtobuff(RoomWorkerAddUserData, RoomWorkerAddUserData.create({
            roomId,
            userId: user.model.id
        }));
    }

    private getWorkerWithRoom(roomId: string) {
        const workerWithRoom = this.workers.find((worker) => worker.getRoom(roomId));

        if(workerWithRoom) {
            return workerWithRoom;
        }

        const workerWithLeastRooms = this.workers.reduce((previousWorker, currentWorker) => {
            return (currentWorker.rooms.length < previousWorker.rooms.length)?(currentWorker):(previousWorker);
        });

        workerWithLeastRooms.rooms.push({
            id: roomId,
            loaded: false,
            users: []
        });

        workerWithLeastRooms.messaging.sendProtobuff(RoomWorkerLoadData, RoomWorkerLoadData.create({
            id: roomId
        }));

        return workerWithLeastRooms;
    }

    private async waitForRoom(roomId: string) {
        return new Promise<void>((resolve) => {
            const worker = this.getWorkerWithRoom(roomId);

            const listener = worker.messaging.addProtobuffListener(RoomWorkerLoadedData, async (payload: RoomWorkerLoadedData) => {
                if(payload.roomId === roomId) {
                    const room = worker.getRoom(roomId);

                    if(!room) {
                        throw new Error("Room is no longer in the worker.");
                    }

                    room.loaded = true;

                    worker.messaging.removeProtobuffListener(RoomWorkerLoadedData, listener);

                    resolve();
                }
            });
        });
    }

    public getOrLoadRoomInstance(roomId: string) {
        /*return this.getRoomInstance(roomId) ?? this.loadRoomInstance(roomId);*/
    }

    public getRoomInstance(roomId: string) {
        const workerWithRoom = this.workers.find((worker) => worker.getRoom(roomId));

        if(!workerWithRoom) {
            return null;
        }

        return workerWithRoom.getRoom(roomId);
    }

    public async loadRoomInstance(roomId: string) {
        /*const room = await RoomModel.findByPk(roomId, {
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
            return null;
        }

        const instance = new Room(room);

        this.instances.push(instance);

        return instance;*/
    }

    public unloadRoom(room: Room) {
        /*if(room.users.length) {
            return;
        }

        room.cancelActionsFrame();

        this.instances.splice(this.instances.indexOf(room), 1);*/
    }
}
