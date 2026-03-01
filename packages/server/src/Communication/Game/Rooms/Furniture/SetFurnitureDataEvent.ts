import User from "../../../../Users/User.js";
import RoomFurniture from "../../../../Rooms/Furniture/RoomFurniture.js";
import { RoomFurnitureData, UpdateRoomFurnitureData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";

export default class SetFurnitureDataEvent implements ProtobuffListener<UpdateRoomFurnitureData> {
    async handle(user: User, payload: UpdateRoomFurnitureData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(!roomUser.hasRights()) {
            throw new Error("User does not have rights.");
        }

        const furniture = user.room.furnitures.find((furniture) => furniture.model.id === payload.id);

        if(!furniture) {
            throw new Error("Furniture does not exist in room.");
        }
        
        if(payload.direction !== undefined) {
            if(payload.position === undefined) {
                furniture.setDirection(payload.direction);
            }
            else {
                furniture.model.direction = payload.direction;
            }
        }

        if(payload.position !== undefined) {
            furniture.setPosition(payload.position, false);
        }

        if(payload.color !== undefined && furniture.model.furniture.interactionType === "postit") {
            furniture.model.color = payload.color;
        }

        if(payload.data) {
            if(furniture.model.furniture.interactionType === "dimmer" && payload.data?.moodlight) {
                await this.handleSingleActiveFurniture(user, furniture);

                furniture.model.data = payload.data;

                furniture.model.animation = (payload.data.moodlight.enabled)?(1):(0);
            }
            else if(furniture.model.furniture.interactionType === "background_toner" && payload.data?.toner) {
                await this.handleSingleActiveFurniture(user, furniture);

                furniture.model.data = payload.data;

                furniture.model.animation = (payload.data.toner.enabled)?(1):(0);
            }
            else {
                furniture.model.data = payload.data
            }
        }

        await furniture.model.save();

        user.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.create({
            furnitureUpdated: [
                furniture.model.toJSON()
            ]
        }));
    }

    private async handleSingleActiveFurniture(user: User, furniture: RoomFurniture) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }

        const activeFurniture = user.room.getActiveFurniture(furniture.model.furniture.interactionType);

        if(activeFurniture && activeFurniture.model.id !== furniture.model.id) {
            activeFurniture.model.animation = 0;

            if(activeFurniture.model.changed()) {
                if(activeFurniture.model.data?.moodlight) {
                    activeFurniture.model.data.moodlight.enabled = false;
                }
                else if(activeFurniture.model.data?.toner) {
                    activeFurniture.model.data.toner.enabled = false;
                }
                
                await activeFurniture.model.save();
    
                user.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.create({
                    furnitureUpdated: [
                        activeFurniture.model.toJSON()
                    ]
                }));
            }
        }
    }
}
