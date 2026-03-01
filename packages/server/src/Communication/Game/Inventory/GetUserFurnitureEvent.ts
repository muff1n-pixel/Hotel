import { GetUserInventoryFurnitureData } from "@pixel63/events";
import User from "../../../Users/User.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class GetUserFurnitureEvent implements ProtobuffListener<GetUserInventoryFurnitureData> {
    public readonly name = "GetUserFurnitureEvent";

    async handle(user: User): Promise<void> {
        await user.getInventory().sendFurniture();
    }
}
