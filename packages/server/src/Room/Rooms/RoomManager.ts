import { FurnitureModel } from "../../Database/Models/Furniture/FurnitureModel.js";
import { RoomModel } from "../../Database/Models/Rooms/RoomModel.js";
import { UserFurnitureModel } from "../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import Room from "./Room.js";
import { UserModel } from "../../Database/Models/Users/UserModel.js";
import { RoomRightsModel } from "../../Database/Models/Rooms/Rights/RoomRightsModel.js";
import { RoomCategoryModel } from "../../Database/Models/Rooms/Categories/RoomCategoryModel.js";
import { UserBotModel } from "../../Database/Models/Users/Bots/UserBotModel.js";
import { UserPetModel } from "../../Database/Models/Users/Pets/UserPetModel.js";
import { PetModel } from "../../Database/Models/Pets/PetModel.js";
import { PetBreedModel } from "../../Database/Models/Pets/PetBreedModel.js";
import { FurnitureCrackableModel } from "../../Database/Models/Furniture/Crackable/FurnitureCrackableModel.js";
import { GroupModel } from "../../Database/Models/Groups/RoomGroupModel.js";
import RoomServer from "../RoomServer.js";
import { ServerRoomData, ServerRoomLoadedData, ServerRoomsData, ServerRoomUnloadedData } from "@pixel63/events";
import { logger } from "../RoomLogger.js";

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
                    model: GroupModel,
                    as: "group"
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
                            as: "furniture",

                            include: [
                                {
                                    model: FurnitureCrackableModel,
                                    as: "crackable"
                                }
                            ]
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
                },
                {
                    model: UserPetModel,
                    as: "roomPets",
                    include: [
                        {
                            model: UserModel,
                            as: "user"
                        },
                        {
                            model: PetModel,
                            as: "pet",

                            include: [
                                {
                                    model: PetBreedModel,
                                    as: "breed"
                                }
                            ]
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

        RoomServer.websocket.sendServerProtobuff(ServerRoomData, instance.getServerData());

        return instance;
    }

    public unloadRoom(room: Room) {
        if(room.users.length) {
            return false;
        }

        const index = this.instances.indexOf(room);

        if(index === -1) {
            logger.warn("Tried to unload already unloaded room.", {
                roomId: room.model.id
            });

            return false;
        }

        this.instances.splice(index, 1);

        logger.verbose("Unloading room " + room.model.id);

        room.unload();

        RoomServer.websocket.sendServerProtobuff(ServerRoomUnloadedData, ServerRoomUnloadedData.create({
            roomId: room.model.id
        }));

        return true;
    }
}
