import { UserFurnitureDataUpdated } from "@shared/WebSocket/Events/User/Inventory/UserFurnitureDataUpdated.js";
import UserClient from "../../Clients/UserClient.js";
import { Furniture } from "../../Database/Models/Furniture/Furniture.js";
import { UserFurniture } from "../../Database/Models/Users/Furniture/UserFurniture.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { randomUUID } from "node:crypto";

export default class UserInventory {
    constructor(private readonly userClient: UserClient) {

    }

    public async setFurnitureQuantity(userFurniture: UserFurniture, quantity: number) {
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
        return await UserFurniture.findOne({
            where: {
                id: userFurnitureId,
                userId: this.userClient.user.id
            },
            include: {
                model: Furniture,
                as: "furniture"
            }
        });
    }

    public async deleteFurniture(userFurniture: UserFurniture) {
        userFurniture.destroy();

        this.userClient.send(new OutgoingEvent<UserFurnitureDataUpdated>("UserFurnitureDataUpdated", {
            deletedUserFurniture: [
                {
                    id: userFurniture.id,
                }
            ]
        }));
    }

    public async addFurniture(furniture: Furniture) {
        let userFurniture = await UserFurniture.findOne<UserFurniture>({
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
            userFurniture = await UserFurniture.create({
                id: randomUUID(),
                userId: this.userClient.user.id,
                furnitureId: furniture.id
            }, {
                include: {
                    model: Furniture,
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

    public async updateFurniture(userFurniture: UserFurniture, updatedFurnitureAttributes: Partial<UserFurniture>) {
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
        const userFurniture = await UserFurniture.findAll<UserFurniture>({
            where: {
                userId: this.userClient.user.id
            },
            include: {
                model: Furniture,
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
