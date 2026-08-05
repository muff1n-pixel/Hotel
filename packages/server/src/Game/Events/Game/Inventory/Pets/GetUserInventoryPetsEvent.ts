import { GetUserInventoryFurnitureData, GetUserInventoryPetsData } from "@pixel63/events";
import { UserProtobuffListener } from "../../../Interfaces/UserProtobuffListener";
import User from "../../../../Users/User";

export default class GetUserInventoryPetsEvent implements UserProtobuffListener<GetUserInventoryPetsData> {
    minimumDurationBetweenEvents?: number = 200;
    
    async handle(user: User): Promise<void> {
        await user.getInventory().sendPets();
    }
}
