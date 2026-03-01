import User from "../../../../Users/User.js";
import RoomFurniture from "../../../../Rooms/Furniture/RoomFurniture.js";
import { UserFurnitureModel } from "../../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { PlaceRoomFurnitureData } from "@pixel63/events";

export default class PlaceFurnitureEvent implements ProtobuffListener<PlaceRoomFurnitureData> {
    public readonly name = "PlaceFurnitureEvent";

    async handle(user: User, payload: PlaceRoomFurnitureData) {
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

        if(!payload.position) {
            throw new Error();
        }

        if(userFurniture.furniture.category === "teleport") {
            await userFurniture.update({
                animation: 0
            });
        }

        await inventory.deleteFurniture(userFurniture);

        await RoomFurniture.place(user.room, userFurniture, payload.position, payload.direction);
    }
}
