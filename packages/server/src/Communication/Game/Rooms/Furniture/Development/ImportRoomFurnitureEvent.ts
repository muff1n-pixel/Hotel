import { ImportRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/Developer/ImportRoomFurnitureEventData";
import IncomingEvent from "../../../../Interfaces/IncomingEvent.js";
import User from "../../../../../Users/User.js";
import OutgoingEvent from "../../../../../Events/Interfaces/OutgoingEvent.js";
import { RoomFurnitureEventData } from "@shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData.js";
import RoomFurniture from "../../../../../Rooms/Furniture/RoomFurniture.js";
import { FurnitureModel } from "../../../../../Database/Models/Furniture/FurnitureModel.js";
import { UserFurnitureModel } from "../../../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { randomUUID } from "node:crypto";

export default class ImportRoomFurnitureEvent implements IncomingEvent<ImportRoomFurnitureEventData> {
    public readonly name = "ImportRoomFurnitureEvent";

    async handle(user: User, event: ImportRoomFurnitureEventData) {
        if(!user.room) {
            return;
        }
        
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("room:import_furniture")) {
            throw new Error("User is not allowed to import furniture.");
        }

        const room = user.room;

        const roomEvents: OutgoingEvent[] = [];

        for(let furnitureData of event.furniture) {
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

            roomEvents.push(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
                furnitureAdded: [
                    roomFurniture.getFurnitureData()
                ]
            }));
        }

        room.sendRoomEvent(roomEvents);
    }
}
