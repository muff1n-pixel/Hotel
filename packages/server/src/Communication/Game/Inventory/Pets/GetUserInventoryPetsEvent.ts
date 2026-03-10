import { GetUserInventoryFurnitureData, GetUserInventoryPetsData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";

export default class GetUserInventoryPetsEvent implements ProtobuffListener<GetUserInventoryPetsData> {
    async handle(user: User): Promise<void> {
        await user.getInventory().sendPets();
    }
}
