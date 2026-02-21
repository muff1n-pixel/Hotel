import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import { UpdateFurnitureEventData } from "@shared/Communications/Requests/Furniture/UpdateFurnitureEventData.js";
import { game } from "../../../index.js";
import { RoomFurnitureEventData } from "@shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData.js";

export default class UpdateFurnitureEvent implements IncomingEvent<UpdateFurnitureEventData> {
    public readonly name = "UpdateFurnitureEvent";

    async handle(user: User, event: UpdateFurnitureEventData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("furniture:edit")) {
            throw new Error("User does not have edit furniture privileges.");
        }

        const furniture = await FurnitureModel.findOne({
            where: {
                id: event.furnitureId
            }
        });

        if(!furniture) {
            throw new Error("Furniture does not exist.");
        }

        await furniture.update({
            name: event.name,
            description: event.description ?? null,

            interactionType: event.interactionType,
            category: event.category,
            
            flags: event.flags,

            dimensions: {
                ...furniture.dimensions,
                depth: event.depth
            }
        });

        for(const room of game.roomManager.instances) {
            const affectedUserFurniture = room.furnitures.filter((userFurniture) => userFurniture.model.furniture.id === furniture.id);

            const outgoingEvent: OutgoingEvent<RoomFurnitureEventData> = new OutgoingEvent("RoomFurnitureEvent", {
                furnitureUpdated: []
            });

            for(const userFurniture of affectedUserFurniture) {
                userFurniture.model.furniture = furniture;

                outgoingEvent.body.furnitureUpdated?.push(userFurniture.getFurnitureData());
            }

            if(outgoingEvent.body.furnitureUpdated?.length) {
                room.sendRoomEvent(outgoingEvent);
            }
        }
    }
}
