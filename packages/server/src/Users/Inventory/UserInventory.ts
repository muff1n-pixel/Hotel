import { UserFurnitureDataUpdated } from "@shared/WebSocket/Events/User/Inventory/UserFurnitureDataUpdated.js";
import UserClient from "../../Clients/UserClient.js";
import { FurnitureModel } from "../../Database/Models/Furniture/FurnitureModel.js";
import { UserFurnitureModel } from "../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { randomUUID } from "node:crypto";

export default class UserInventory {
    constructor(private readonly userClient: UserClient) {

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
                userId: this.userClient.user.id
            },
            include: {
                model: FurnitureModel,
                as: "furniture"
            }
        });
    }

    public async deleteFurniture(userFurniture: UserFurnitureModel) {
        userFurniture.destroy();

        this.userClient.send(new OutgoingEvent<UserFurnitureDataUpdated>("UserFurnitureDataUpdated", {
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
                userId: this.userClient.user.id,
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
                userId: this.userClient.user.id,
                furnitureId: furniture.id
            }, {
                include: {
                    model: FurnitureModel,
                    as: "furniture"
                }
            });
        }

        this.userClient.send(new OutgoingEvent<UserFurnitureDataUpdated>("UserFurnitureDataUpdated", {
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

        this.userClient.send(new OutgoingEvent<UserFurnitureDataUpdated>("UserFurnitureDataUpdated", {
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
                userId: this.userClient.user.id
            },
            include: {
                model: FurnitureModel,
                as: "furniture"
            }
        });
    
        this.userClient.send(new OutgoingEvent<UserFurnitureDataUpdated>("UserFurnitureDataUpdated", {
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
