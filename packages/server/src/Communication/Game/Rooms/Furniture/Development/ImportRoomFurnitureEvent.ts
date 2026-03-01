import User from "../../../../../Users/User.js";
import OutgoingEvent from "../../../../../Events/Interfaces/OutgoingEvent.js";
import RoomFurniture from "../../../../../Rooms/Furniture/RoomFurniture.js";
import { FurnitureModel } from "../../../../../Database/Models/Furniture/FurnitureModel.js";
import { UserFurnitureModel } from "../../../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { randomUUID } from "node:crypto";
import { RoomFurnitureData, RoomFurnitureImportData } from "@pixel63/events";
import ProtobuffListener from "../../../../Interfaces/ProtobuffListener.js";

export default class ImportRoomFurnitureEvent implements ProtobuffListener<RoomFurnitureImportData> {
    async handle(user: User, payload: RoomFurnitureImportData) {
        if(!user.room) {
            return;
        }
        
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("room:import_furniture")) {
            throw new Error("User is not allowed to import furniture.");
        }

        const room = user.room;

        for(let furnitureData of payload.furniture) {
            const furniture = await FurnitureModel.findOne({
                where: {
                    type: furnitureData.type,
                    color: furnitureData.color
                }
            });

            if(!furniture) {
                console.warn("Furniture for type and color does not exist.", {
                    type: furnitureData.type,
                    color: furnitureData.color
                });

                continue;
            }

            const userFurniture = await UserFurnitureModel.create({
                id: randomUUID(),
                position: furnitureData.position,
                direction: furnitureData.direction,
                animation: furnitureData.animation,
                data: furnitureData.data,
                
                roomId: room.model.id,
                userId: user.model.id,
                furnitureId: furniture.id
            });

            userFurniture.user = user.model;
            userFurniture.furniture = furniture;
    
            const roomFurniture = new RoomFurniture(room, userFurniture);
    
            room.furnitures.push(roomFurniture);

            room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.create({
                furnitureAdded: [
                    roomFurniture.model.toJSON()
                ]
            }));
        }
    }
}
