import { PlaceFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/PlaceFurnitureEventData";
import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import RoomFurniture from "../../../../Rooms/Furniture/RoomFurniture.js";

export default class PlaceFurnitureEvent implements IncomingEvent<PlaceFurnitureEventData> {
    async handle(user: User, event: PlaceFurnitureEventData) {
        if(!user.room) {
            return;
        }

        const inventory = user.getInventory();

        const userFurniture = await inventory.getFurnitureById(event.userFurnitureId);

        if(!userFurniture) {
            throw new Error("User does not have a user furniture by this id.");
        }

        inventory.setFurnitureQuantity(userFurniture, userFurniture.quantity - 1);

        RoomFurniture.create(user.room, userFurniture.furniture, event.position, event.direction);
    }
}
