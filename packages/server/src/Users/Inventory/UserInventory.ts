import { UserFurnitureEventData } from "@shared/Communications/Responses/Inventory/UserFurnitureEventData.js";
import User from "../User.js";
import { FurnitureModel } from "../../Database/Models/Furniture/FurnitureModel.js";
import { UserFurnitureModel } from "../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { randomUUID } from "node:crypto";

export default class UserInventory {
    constructor(private readonly user: User) {

    }

    public async setFurnitureQuantity(userFurniture: UserFurnitureModel, quantity: number) {
        if(quantity <= 0) {
            this.deleteFurniture(userFurniture);
        }
        else {
            this.updateFurniture(userFurniture, {
                quantity
            });
        }
    }

    public async getFurnitureById(userFurnitureId: string) {
        return await UserFurnitureModel.findOne({
            where: {
                id: userFurnitureId,
                userId: this.user.model.id
            },
            include: {
                model: FurnitureModel,
                as: "furniture"
            }
        });
    }

    public async deleteFurniture(userFurniture: UserFurnitureModel) {
        userFurniture.destroy();

        this.user.send(new OutgoingEvent<UserFurnitureEventData>("UserFurnitureEvent", {
            deletedUserFurniture: [
                {
                    id: userFurniture.id,
                }
            ]
        }));
    }

    public async addFurniture(furniture: FurnitureModel) {
        let userFurniture = await UserFurnitureModel.findOne<UserFurnitureModel>({
            where: {
                userId: this.user.model.id,
                furnitureId: furniture.id
            }
        });

        if(userFurniture) {
            userFurniture = await userFurniture.update({
                quantity: userFurniture.quantity + 1
            });
        }
        else {
            userFurniture = await UserFurnitureModel.create({
                id: randomUUID(),
                userId: this.user.model.id,
                furnitureId: furniture.id
            }, {
                include: {
                    model: FurnitureModel,
                    as: "furniture"
                }
            });
        }

        this.user.send(new OutgoingEvent<UserFurnitureEventData>("UserFurnitureEvent", {
            updatedUserFurniture: [
                {
                    id: userFurniture.id,
                    quantity: userFurniture.quantity,
                    furnitureData: furniture
                }
            ]
        }));
    }

    public async updateFurniture(userFurniture: UserFurnitureModel, updatedFurnitureAttributes: Partial<UserFurnitureModel>) {
        await userFurniture.update(updatedFurnitureAttributes);

        this.user.send(new OutgoingEvent<UserFurnitureEventData>("UserFurnitureEvent", {
            updatedUserFurniture: [
                {
                    id: userFurniture.id,
                    quantity: userFurniture.quantity,
                    furnitureData: userFurniture.furniture
                }
            ]
        }));
    }

    public async sendFurniture() {
        const userFurniture = await UserFurnitureModel.findAll<UserFurnitureModel>({
            where: {
                userId: this.user.model.id
            },
            include: {
                model: FurnitureModel,
                as: "furniture"
            },
            order: [['updatedAt','DESC']]
        });
    
        this.user.send(new OutgoingEvent<UserFurnitureEventData>("UserFurnitureEvent", {
            allUserFurniture: userFurniture.map((userFurniture) => {
                return {
                    id: userFurniture.id,
                    quantity: userFurniture.quantity,
                    furnitureData: userFurniture.furniture
                };
            })
        }));
    }
}
