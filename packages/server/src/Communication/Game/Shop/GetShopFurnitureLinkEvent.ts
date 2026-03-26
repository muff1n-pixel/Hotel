import User from "../../../Users/User.js";
import { ShopPageFurnitureModel } from "../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { GetShopFurnitureLinkData, ShopFurnitureLinkData } from "@pixel63/events";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";

export default class GetShopFurnitureLinkEvent implements ProtobuffListener<GetShopFurnitureLinkData> {
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
