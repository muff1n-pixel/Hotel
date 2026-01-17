import { UserFurnitureDataUpdated } from "@shared/WebSocket/Events/User/Inventory/UserFurnitureDataUpdated.js";
import UserClient from "../../Clients/UserClient.js";
import { Furniture } from "../../Database/Models/Furniture/Furniture.js";
import { UserFurniture } from "../../Database/Models/Users/Furniture/UserFurniture.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { randomUUID } from "node:crypto";

export default class UserInventory {
    constructor(private readonly userClient: UserClient) {

    }

    public async addFurniture(furniture: Furniture) {
        const userFurniture = await UserFurniture.create({
            id: randomUUID(),
            userId: this.userClient.user.id,
            furnitureId: furniture.id
        }, {
            include: {
                model: Furniture,
                as: "furniture"
            }
        });

        this.userClient.send(new OutgoingEvent<UserFurnitureDataUpdated>("UserFurnitureDataUpdated", {
            updatedUserFurniture: [
                {
                    id: userFurniture.id,
                    furnitureData: furniture
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
                    furnitureData: userFurniture.furniture
                };
            })
        }));
    }
}
