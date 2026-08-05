import { FurnitureData, GetShopGiftFurnitureData, ShopGiftFurnitureData } from "@pixel63/events";
import { FurnitureModel } from "../../../../../Database/Models/Furniture/FurnitureModel.js";
import User from "../../../../Users/User.js";
import { UserProtobuffListener } from "../../../Interfaces/UserProtobuffListener.js";

export default class GetShopGiftFurnitureEvent implements UserProtobuffListener<GetShopGiftFurnitureData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(user: User) {
        const furniture = await FurnitureModel.findAll({
            where: {
                interactionType: "gift"
            }
        });

        user.sendProtobuff(ShopGiftFurnitureData, ShopGiftFurnitureData.create({
            furniture: furniture.map((furniture) => FurnitureData.fromJSON(furniture))
        }));
    }
}
