import User from "../../../../Users/User.js";
import RoomFurniture from "../../../../Rooms/Furniture/RoomFurniture.js";
import { RoomFurnitureData, RoomPositionOffsetData, UpdateRoomFurnitureData, WidgetNotificationData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { randomUUID } from "node:crypto";

export default class UpdateRoomFurnitureEvent implements ProtobuffListener<UpdateRoomFurnitureData> {
    minimumDurationBetweenEvents?: number = 100;
    
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

        if(furniture.model.furniture.placement === "floor" && (payload.direction || payload.position)) {
            const dimensions = furniture.getDimensions(payload.direction ?? furniture.model.direction);
            const position = payload.position ?? furniture.model.position;

            for(let row = position.row; row < position.row + dimensions.row; row++) {
                for(let column = position.column; column < position.column + dimensions.column; column++) {
                    if(!furniture.room.model.structure.grid[row]?.[column] || furniture.room.model.structure.grid[row]?.[column] === 'X') {
                        user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                            id: randomUUID(),
                            text: `You can not place this furniture here!`
                        }));

                        return;
                    }

                    const upmostFurniture = roomUser.room.getUpmostFurnitureAtPosition(RoomPositionOffsetData.create({
                        row,
                        column
                    }));

                    if(!upmostFurniture) {
                        continue;
                    }

                    if(upmostFurniture.model.id === furniture.model.id) {
                        continue;
                    }

                    if(!upmostFurniture.model.furniture.flags.stackable) {
                        user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                            id: randomUUID(),
                            text: `You can not place this furniture here!`
                        }));

                        return;
                    }
                }
            }
        }

        let previousDirection = furniture.model.direction;
        
        if(payload.direction !== undefined) {
            if(payload.position === undefined && furniture.model.position && furniture.model.furniture.placement === "floor") {
                const upmostFurniture = roomUser.room.getUpmostFurnitureAtPosition(RoomPositionOffsetData.fromJSON(furniture.model.position));

                if(upmostFurniture && upmostFurniture.model.id !== furniture.model.id) {
                    if(!upmostFurniture.model.furniture.flags.stackable) {
                        user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                            id: randomUUID(),
                            text: `You can not place this furniture here!`
                        }));

                        return;
                    }

                    payload.position = furniture.model.position;
                    payload.position.depth = upmostFurniture.model.position.depth + upmostFurniture.model.furniture.dimensions.depth + 0.0001;
                }
            }

            if(payload.position === undefined) {
                await furniture.setDirection(payload.direction, false);
            }
            else {
                furniture.model.direction = payload.direction;
            }
        }

        if(payload.position !== undefined) {
            await furniture.setPosition(payload.position, false, previousDirection);
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

            furniture.logic?.handleDataChanged?.(roomUser);
        }

        if(furniture.model.changed()) {
            await furniture.model.save();

            user.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
                furnitureUpdated: [
                    {
                        userId: user.model.id,
                        furniture: furniture.model
                    }
                ]
            }));
        }
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
    
                user.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
                    furnitureUpdated: [
                        activeFurniture.model
                    ]
                }));
            }
        }
    }
}
