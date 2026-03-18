import User from "../../../Users/User.js";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";
import { game } from "../../../index.js";
import { RoomFurnitureData, UpdateFurnitureData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { randomUUID } from "node:crypto";

export default class UpdateFurnitureEvent implements ProtobuffListener<UpdateFurnitureData> {
    async handle(user: User, payload: UpdateFurnitureData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("furniture:edit")) {
            throw new Error("User does not have edit furniture privileges.");
        }

        let updatedFurniture: FurnitureModel | undefined;

        if(payload.id) {
            const furniture = await FurnitureModel.findOne({
                where: {
                    id: payload.id
                }
            });

            if(!furniture) {
                throw new Error("Furniture does not exist.");
            }

            updatedFurniture = await furniture.update({
                type: payload.type,
                color: payload.color ?? null,

                name: payload.name,
                description: payload.description ?? null,

                placement: payload.placement,
                interactionType: payload.interactionType,
                category: payload.category,
                
                flags: payload.flags,

                dimensions: {
                    ...furniture.dimensions,
                    depth: payload.depth
                }
            });
        }
        else {
            const existingFurniture = await FurnitureModel.findOne({
                where: {
                    type: payload.type,
                    color: payload.color ?? null
                }
            });

            if(existingFurniture) {
                throw new Error("Furniture already exists.");
            }

            updatedFurniture = await FurnitureModel.create({
                id: randomUUID(),

                type: payload.type,
                color: payload.color ?? null,

                name: payload.name,
                description: payload.description ?? null,

                placement: payload.placement,
                interactionType: payload.interactionType,
                category: payload.category,
                
                flags: payload.flags,

                dimensions: {
                    row: 1,
                    column: 1,
                    depth: payload.depth
                }
            });
        }

        if(updatedFurniture) {
            for(const room of game.roomManager.instances) {
                const affectedUserFurniture = room.furnitures.filter((userFurniture) => userFurniture.model.furniture.id === updatedFurniture.id);

                const furnitureRemoved: RoomFurnitureData[] = [];

                for(const userFurniture of affectedUserFurniture) {
                    userFurniture.model.furniture = updatedFurniture;

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
}
