import { FurnitureData, GetShopGiftFurnitureData, ShopGiftFurnitureData } from "@pixel63/events";
import { FurnitureModel } from "../../../../Database/Models/Furniture/FurnitureModel.js";
import User from "../../../../Users/User.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";

export default class GetShopGiftFurnitureEvent implements ProtobuffListener<GetShopGiftFurnitureData> {
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
