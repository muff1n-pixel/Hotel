import { UserFurnitureModel } from "../../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { PlaceRoomContentFurnitureData, ServerUserInventoryUpdatedData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import User from "../../../Users/User.js";
import { FurnitureModel } from "../../../../Database/Models/Furniture/FurnitureModel.js";
import { UserModel } from "../../../../Database/Models/Users/UserModel.js";
import RoomServer from "../../../RoomServer.js";

export default class PlaceRoomContentFurnitureEvent implements RoomProtobuffListener<PlaceRoomContentFurnitureData> {
    minimumDurationBetweenEvents?: number = 100;
    
    async handle(user: User, payload: PlaceRoomContentFurnitureData) {
        if(!user.roomUser.hasRights()) {
            throw new Error("User does not have rights.");
        }
        
        const userFurniture = await UserFurnitureModel.findOne({
            where: {
                ...((payload.stackable)?({
                    furnitureId: payload.furnitureId,
                }):({
                    id: payload.id,
                })),
                userId: user.id,
                roomId: null,
                traxId: null,
                giftId: null
            },
            include: [
                {
                    model: FurnitureModel,
                    as: "furniture"
                },
                {
                    model: UserModel,
                    as: "user"
                }
            ]
        });

        if(!userFurniture) {
            throw new Error("User does not have a user furniture by this id.");
        }

        if(userFurniture.furniture.type === "wallpaper") {
            if(userFurniture.furniture.color === undefined) {
                throw new Error("User room content furniture does not have a color.");
            }

            await user.roomUser.room.setWallId(userFurniture.furniture.color);

            await userFurniture.destroy();

            RoomServer.websocket.sendServerProtobuff(ServerUserInventoryUpdatedData, ServerUserInventoryUpdatedData.create({
                userId: user.id,
                furnitureRemoved: [userFurniture.id]
            }));
        }
        else if(userFurniture.furniture.type === "floor") {
            if(userFurniture.furniture.color === undefined) {
                throw new Error("User room content furniture does not have a color.");
            }

            await user.roomUser.room.setFloorId(userFurniture.furniture.color);

            await userFurniture.destroy();

            RoomServer.websocket.sendServerProtobuff(ServerUserInventoryUpdatedData, ServerUserInventoryUpdatedData.create({
                userId: user.id,
                furnitureRemoved: [userFurniture.id]
            }));
        }
        else if(userFurniture.furniture.type === "landscape") {
            if(userFurniture.furniture.color === undefined) {
                throw new Error("User room content furniture does not have a color.");
            }

            await user.roomUser.room.setLandscapeId(userFurniture.furniture.color);

            await userFurniture.destroy();

            RoomServer.websocket.sendServerProtobuff(ServerUserInventoryUpdatedData, ServerUserInventoryUpdatedData.create({
                userId: user.id,
                furnitureRemoved: [userFurniture.id]
            }));
        }
        else {
            throw new Error("User furniture is not of room content type.");
        }
    }
}
