import { UserFurnitureEventData } from "@shared/Communications/Responses/Inventory/UserFurnitureEventData.js";
import { InventoryBadgesEventData } from "@shared/Communications/Responses/Inventory/UserBadgesEventData.js";
import User from "../User.js";
import { FurnitureModel } from "../../Database/Models/Furniture/FurnitureModel.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { randomUUID } from "node:crypto";
import { UserFurnitureModel } from "../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { UserModel } from "../../Database/Models/Users/UserModel.js";
import { UserBadgeModel } from "../../Database/Models/Users/Badges/UserBadgeModel.js";
import { BadgeModel } from "../../Database/Models/Badges/BadgeModel.js";
import { UserBotModel } from "../../Database/Models/Users/Bots/UserBotModel.js";
import { UserBotsEventData } from "@shared/Communications/Responses/Inventory/UserBotsEventData.js";

export default class UserInventory {
    constructor(private readonly user: User) {

    }

    public async getFurnitureById(userFurnitureId: string) {
        return await UserFurnitureModel.findOne({
            where: {
                id: userFurnitureId,
                userId: this.user.model.id,
                roomId: null
            },
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
        });
    }

    public async getBotById(userBotId: string) {
        return await UserBotModel.findOne({
            where: {
                id: userBotId,
                userId: this.user.model.id,
                roomId: null
            },
            include: [
                {
                    model: UserModel,
                    as: "user"
                }
            ]
        });
    }

    public async getFurnitureByType(furnitureId: string) {
        return await UserFurnitureModel.findOne({
            where: {
                furnitureId,
                userId: this.user.model.id,
                roomId: null
            },
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
        });
    }

    public async getFurnitureCount(furnitureId: string) {
        return await UserFurnitureModel.count({
            where: {
                furnitureId,
                userId: this.user.model.id,
                roomId: null
            }
        });
    }

    public async deleteFurniture(userFurniture: UserFurnitureModel) {
        if(userFurniture.furniture.flags.inventoryStackable) {
            const count = await this.getFurnitureCount(userFurniture.furniture.id);

            if(count > 1) {
                this.user.send(new OutgoingEvent<UserFurnitureEventData>("UserFurnitureEvent", {
                    updatedUserFurniture: [
                        {
                            id: userFurniture.id,
                            quantity: count,
                            furniture: userFurniture.furniture
                        }
                    ]
                }));

                return;
            }
        }

        this.user.send(new OutgoingEvent<UserFurnitureEventData>("UserFurnitureEvent", {
            deletedUserFurniture: [
                {
                    id: userFurniture.id,
                    furniture: userFurniture.furniture
                }
            ]
        }));
    }

    public async addFurniture(userFurniture: UserFurnitureModel) {
        this.user.send(new OutgoingEvent<UserFurnitureEventData>("UserFurnitureEvent", {
            updatedUserFurniture: [
                {
                    id: userFurniture.id,
                    quantity: (userFurniture.furniture.flags.inventoryStackable)?(await this.getFurnitureCount(userFurniture.furniture.id)):(1),
                    furniture: userFurniture.furniture
                }
            ]
        }));
    }

    public async addBot(userBot: UserBotModel) {
        this.user.send(new OutgoingEvent<UserBotsEventData>("UserBotsEvent", {
            updatedUserBots: [
                userBot,
            ]
        }));
    }

    public async removeBot(userBot: UserBotModel) {
        this.user.send(new OutgoingEvent<UserBotsEventData>("UserBotsEvent", {
            deletedUserBots: [
                userBot,
            ]
        }));
    }

    public async sendFurniture() {
        const userFurnitures = await UserFurnitureModel.findAll({
            where: {
                userId: this.user.model.id,
                roomId: null
            },
            include: {
                model: FurnitureModel,
                as: "furniture"
            },
            order: [['updatedAt','DESC']]
        });

        const allUserFurniture: UserFurnitureEventData["allUserFurniture"] = [];

        for(const userFurniture of userFurnitures) {
            if(userFurniture.furniture.flags.inventoryStackable) {
                const existingUserfurniture = allUserFurniture.find((furniture) => furniture.furniture.id === userFurniture.furniture.id);

                if(existingUserfurniture) {
                    existingUserfurniture.quantity++;
                }
                else {
                    allUserFurniture.push({
                        id: userFurniture.id,
                        quantity: 1,
                        furniture: userFurniture.furniture
                    });
                }
            }
            else {
                allUserFurniture.push({
                    id: userFurniture.id,
                    quantity: 1,
                    furniture: userFurniture.furniture
                });
            }
        }
    
        this.user.send(new OutgoingEvent<UserFurnitureEventData>("UserFurnitureEvent", {
            allUserFurniture
        }));
    }

    public async sendBots() {
        const userBots = await UserBotModel.findAll({
            where: {
                userId: this.user.model.id,
                roomId: null
            },
            order: [['updatedAt','DESC']]
        });

        this.user.send(new OutgoingEvent<UserBotsEventData>("UserBotsEvent", {
            allUserBots: userBots
        }));
    }

    public async sendBadges() {
        const userBadges = await UserBadgeModel.findAll({
            where: {
                userId: this.user.model.id
            },
            include: {
                model: BadgeModel,
                as: "badge"
            },
            order: [['updatedAt', 'DESC']]
        });
    
        this.user.send(new OutgoingEvent<InventoryBadgesEventData>("InventoryBadgesEvent", {
            badges: userBadges.map((userBadge) => {
                return {
                    id: userBadge.id,
                    badge: {
                        id: userBadge.badge.id,
                        name: userBadge.badge.name,
                        description: userBadge.badge.description,
                        image: userBadge.badge.image
                    },
                    equipped: userBadge.equipped
                };
            })
        }));
    }
}
