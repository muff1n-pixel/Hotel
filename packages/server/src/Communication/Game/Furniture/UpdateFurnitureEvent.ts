import User from "../../../Users/User.js";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";
import { game } from "../../../index.js";
import { RoomFurnitureData, UpdateFurnitureData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class UpdateFurnitureEvent implements ProtobuffListener<UpdateFurnitureData> {
    async handle(user: User, payload: UpdateFurnitureData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("furniture:edit")) {
            throw new Error("User does not have edit furniture privileges.");
        }

        const furniture = await FurnitureModel.findOne({
            where: {
                id: payload.id
            }
        });

        if(!furniture) {
            throw new Error("Furniture does not exist.");
        }

        await furniture.update({
            name: payload.name,
            description: payload.description ?? null,

            interactionType: payload.interactionType,
            category: payload.category,
            
            flags: payload.flags,

            dimensions: {
                ...furniture.dimensions,
                depth: payload.depth
            }
        });

        for(const room of game.roomManager.instances) {
            const affectedUserFurniture = room.furnitures.filter((userFurniture) => userFurniture.model.furniture.id === furniture.id);

            const furnitureRemoved: RoomFurnitureData[] = [];

            for(const userFurniture of affectedUserFurniture) {
                userFurniture.model.furniture = furniture;

                furnitureRemoved.push(RoomFurnitureData.fromJSON(userFurniture.model));
            }

            if(furnitureRemoved.length) {
                room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
                    furnitureRemoved
                }));
            }
        }
    }
}
