import User from "../../../Users/User.js";
import { ShopPageFurnitureModel } from "../../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";
import { GetShopFurnitureLinkData, ShopFurnitureLinkData } from "@pixel63/events";
import { ShopPageModel } from "../../../../Database/Models/Shop/ShopPageModel.js";

export default class GetShopFurnitureLinkEvent implements UserProtobuffListener<GetShopFurnitureLinkData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(user: User, payload: GetShopFurnitureLinkData) {
        const shopFurniture = await ShopPageFurnitureModel.findOne({
            where: {
                furnitureId: payload.furnitureId
            },

            include: [
                {
                    model: ShopPageModel,
                    as: "shopPage"
                }
            ]
        });

        user.sendProtobuff(ShopFurnitureLinkData, ShopFurnitureLinkData.create({
            furnitureId: payload.furnitureId,

            category: shopFurniture?.shopPage.category,
            pageId: shopFurniture?.shopPage.id,
        }));
    }
}
