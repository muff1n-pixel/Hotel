import User from "../../../Users/User.js";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { GetShopPageFurnitureEventData } from "@shared/Communications/Requests/Shop/GetShopPageFurnitureEventData.js";
import { ShopPageFurnitureModel } from "../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";
import { ShopPageFurnitureData } from "@pixel63/events";

export default class GetShopPageFurnitureEvent implements IncomingEvent<GetShopPageFurnitureEventData> {
    public readonly name = "GetShopPageFurnitureEvent";

    async handle(user: User, event: GetShopPageFurnitureEventData) {
        const shopPage = await ShopPageModel.findByPk(event.pageId, {
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

        user.sendProtobuff(ShopPageFurnitureData, ShopPageFurnitureData.create({
            pageId: shopPage.id,
            furniture: shopPage.furniture.map((furniture) => {
                return {
                    id: furniture.id,
                    furniture: furniture.furniture.toJSON(),
                    credits: furniture.credits,
                    duckets: furniture.duckets,
                    diamonds: furniture.diamonds
                }
            })
        }));
    }
}