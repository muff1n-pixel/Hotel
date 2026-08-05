import User from "../../../Users/User.js";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";
import { GetShopPageLinkData, ShopPageLinkData } from "@pixel63/events";
import { ShopPageModel } from "../../../../Database/Models/Shop/ShopPageModel.js";

export default class GetShopPageLinkEvent implements UserProtobuffListener<GetShopPageLinkData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(user: User, payload: GetShopPageLinkData) {
        const shopPage = await ShopPageModel.findOne({
            where: {
                type: payload.type
            }
        });

        user.sendProtobuff(ShopPageLinkData, ShopPageLinkData.create({
            type: payload.type,

            category: shopPage?.category,
            pageId: shopPage?.id,
        }));
    }
}
