import { GetUserInventoryFurnitureData } from "@pixel63/events";
import User from "../../../Users/User.js";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";

export default class GetUserFurnitureEvent implements UserProtobuffListener<GetUserInventoryFurnitureData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: GetUserInventoryFurnitureData): Promise<void> {
        await user.getInventory().sendFurniture(payload.trading);
    }
}
