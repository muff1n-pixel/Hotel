import { ServerRoomData, ServerUserInventoryUpdatedData, UserInventoryFurnitureCollectionData, UserInventoryFurnitureData } from "@pixel63/events";
import ProtobuffListener from "../../../Communication/Interfaces/ProtobuffListener";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomServerClient from "../../Rooms/RoomServerClient";
import { game } from "../..";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel";
import { Op } from "sequelize";
import { UserModel } from "../../../Database/Models/Users/UserModel";
import User from "../../Users/User";
import UserInventory from "../../Users/Inventory/UserInventory";
import { UserPetModel } from "../../../Database/Models/Users/Pets/UserPetModel";
import { UserBotModel } from "../../../Database/Models/Users/Bots/UserBotModel";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel";
import { PetBreedModel } from "../../../Database/Models/Pets/PetBreedModel";
import { PetModel } from "../../../Database/Models/Pets/PetModel";
import RoomServer from "../../Rooms/RoomServer";

export default class ServerUserInventoryUpdatedEvent implements ServerProtobuffListener<ServerUserInventoryUpdatedData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(client: RoomServer, payload: ServerUserInventoryUpdatedData) {
        const user = game.getUserById(payload.userId);

        if(!user) {
            throw new Error("User is not connected.");
        }

        const inventory = user.getInventory();

        await this.handleFurniture(user, inventory, payload);
        await this.handlePets(user, inventory, payload);
        await this.handleBots(user, inventory, payload);
    }

    private async handleFurniture(user: User, inventory: UserInventory, payload: ServerUserInventoryUpdatedData) {
        if(payload.furnitureAdded.length) {
            const models = await UserFurnitureModel.findAll({
                where: {
                    id: {
                        [Op.in]: payload.furnitureAdded
                    },
                    userId: user.model.id
                },
                include: [
                    {
                        model: UserModel,
                        as: "user"
                    },
                    {
                        model: FurnitureModel,
                        as: "furniture"
                    }
                ]
            });

            for(const model of models) {
                inventory.addFurniture(model);
            }
        }
        

        if(payload.furnitureRemoved.length) {
            const models = await UserFurnitureModel.findAll({
                where: {
                    id: {
                        [Op.in]: payload.furnitureRemoved
                    },
                    userId: user.model.id
                },
                include: [
                    {
                        model: UserModel,
                        as: "user"
                    },
                    {
                        model: FurnitureModel,
                        as: "furniture"
                    }
                ]
            });

            for(const model of models) {
                inventory.deleteFurniture(model);
            }
        }
    }
    
    private async handlePets(user: User, inventory: UserInventory, payload: ServerUserInventoryUpdatedData) {
        if(payload.petsAdded.length) {
            const models = await UserPetModel.findAll({
                where: {
                    id: {
                        [Op.in]: payload.petsAdded
                    },
                    userId: user.model.id
                },
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
            });

            for(const model of models) {
                inventory.addPet(model);
            }
        }
        

        if(payload.petsRemoved.length) {
            const models = await UserPetModel.findAll({
                where: {
                    id: {
                        [Op.in]: payload.petsRemoved
                    },
                    userId: user.model.id
                },
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
            });

            for(const model of models) {
                inventory.removePet(model);
            }
        }
    }
    
    private async handleBots(user: User, inventory: UserInventory, payload: ServerUserInventoryUpdatedData) {
        if(payload.botsAdded.length) {
            const models = await UserBotModel.findAll({
                where: {
                    id: {
                        [Op.in]: payload.botsAdded
                    },
                    userId: user.model.id
                },
                include: {
                    model: UserModel,
                    as: "user"
                }
            });

            for(const model of models) {
                inventory.addBot(model);
            }
        }
        

        if(payload.botsRemoved.length) {
            const models = await UserBotModel.findAll({
                where: {
                    id: {
                        [Op.in]: payload.botsRemoved
                    },
                    userId: user.model.id
                },
                include: {
                    model: UserModel,
                    as: "user"
                }
            });

            for(const model of models) {
                inventory.removeBot(model);
            }
        }
    }
}
