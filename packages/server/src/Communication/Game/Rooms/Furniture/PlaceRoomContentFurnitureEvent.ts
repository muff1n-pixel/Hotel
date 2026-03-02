import User from "../../../../Users/User.js";
import { UserFurnitureModel } from "../../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { PlaceRoomContentFurnitureData } from "@pixel63/events";

export default class PlaceRoomContentFurnitureEvent implements ProtobuffListener<PlaceRoomContentFurnitureData> {
    public readonly name = "PlaceRoomContentFurnitureEvent";

    async handle(user: User, payload: PlaceRoomContentFurnitureData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(!roomUser.hasRights()) {
            throw new Error("User does not have rights.");
        }

        const inventory = user.getInventory();

        let userFurniture: UserFurnitureModel | null = null;
        
        if(payload.stackable) {
            userFurniture = await inventory.getFurnitureByType(payload.furnitureId);
        }
        else {
            userFurniture = await inventory.getFurnitureById(payload.id);
        }

        if(!userFurniture) {
            throw new Error("User does not have a user furniture by this id.");
        }

        if(userFurniture.furniture.type === "wallpaper") {
            if(userFurniture.furniture.color === undefined) {
                throw new Error("User room content furniture does not have a color.");
            }

            user.room.setWallId(userFurniture.furniture.color);

            await userFurniture.destroy();

            inventory.deleteFurniture(userFurniture);
        }
        else if(userFurniture.furniture.type === "floor") {
            if(userFurniture.furniture.color === undefined) {
                throw new Error("User room content furniture does not have a color.");
            }

            user.room.setFloorId(userFurniture.furniture.color);

            await userFurniture.destroy();

            inventory.deleteFurniture(userFurniture);
        }
        else {
            throw new Error("User furniture is not of room content type.");
        }
    }
}
