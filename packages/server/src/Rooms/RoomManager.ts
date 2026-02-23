import { FurnitureModel } from "../Database/Models/Furniture/FurnitureModel.js";
import { RoomModel } from "../Database/Models/Rooms/RoomModel.js";
import { UserFurnitureModel } from "../Database/Models/Users/Furniture/UserFurnitureModel.js";
import Room from "./Room.js";
import { UserModel } from "../Database/Models/Users/UserModel.js";
import { RoomRightsModel } from "../Database/Models/Rooms/Rights/RoomRightsModel.js";
import { RoomCategoryModel } from "../Database/Models/Rooms/Categories/RoomCategoryModel.js";
import { UserBotModel } from "../Database/Models/Users/Bots/UserBotModel.js";

// TODO: do we really need the Room model in the functions or is it sufficient with a roomId?
export default class RoomManager {
    public instances: Room[] = [];

    constructor() {
    }

    public getOrLoadRoomInstance(roomId: string) {
        return this.getRoomInstance(roomId) ?? this.loadRoomInstance(roomId);
    }

    public getRoomInstance(roomId: string) {
        const instance = this.instances.find((instance) => instance.model.id === roomId);

        if(!instance) {
            return null;
        }

        return instance;
    }

    public async loadRoomInstance(roomId: string) {
        const room = await RoomModel.findByPk(roomId, {
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

        return instance;
    }

    public unloadRoom(room: Room) {
        if(room.users.length) {
            return;
        }

        room.cancelActionsFrame();

        this.instances.splice(this.instances.indexOf(room), 1);
    }
}
