import User from "../../../Users/User.js";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";
import { ShopPageFurnitureModel } from "../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";
import { GetShopPageFurnitureData, ShopPageFurnitureData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class GetShopPageFurnitureEvent implements ProtobuffListener<GetShopPageFurnitureData> {
    public readonly name = "GetShopPageFurnitureEvent";

    async handle(user: User, payload: GetShopPageFurnitureData) {
        const shopPage = await ShopPageModel.findByPk(payload.pageId, {
            include: {
                model: ShopPageFurnitureModel,
                as: "furniture",
                include: [
                    {
                        model: FurnitureModel,
                        as: "furniture"
                    }
                ]
            }
        });

        if(!shopPage) {
            throw new Error("Shop page does not exist.");
        }

        user.sendProtobuff(ShopPageFurnitureData, ShopPageFurnitureData.fromJSON({
            pageId: shopPage.id,
            furniture: shopPage.furniture.map((furniture) => {
                return {
                    id: furniture.id,
                    furniture: furniture.furniture,
                    credits: furniture.credits,
                    duckets: furniture.duckets,
                    diamonds: furniture.diamonds
                }
            })
        }));
    }
}