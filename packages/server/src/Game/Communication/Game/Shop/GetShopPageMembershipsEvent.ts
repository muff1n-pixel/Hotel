import User from "../../../Users/User.js";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";
import { GetShopPageMembershipsData, ShopMembershipsData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { ShopPageMembershipModel } from "../../../Database/Models/Shop/ShopPageMembershipModel.js";

export default class GetShopPageMembershipsEvent implements ProtobuffListener<GetShopPageMembershipsData> {
    minimumDurationBetweenEvents?: number = 20;

    async handle(user: User, payload: GetShopPageMembershipsData) {
        const shopPage = await ShopPageModel.findByPk(payload.pageId, {
            include: {
                model: ShopPageMembershipModel,
                as: "memberships"
            }
        });

        if(!shopPage) {
            throw new Error("Shop page does not exist.");
        }

        user.sendProtobuff(ShopMembershipsData, ShopMembershipsData.create({
            pageId: shopPage.id,
            memberships: shopPage.memberships.map((membership) => {
                return {
                    id: membership.id,

                    membership: membership.membership,
                    days: membership.days,

                    credits: membership.credits,
                    duckets: membership.duckets,
                    diamonds: membership.diamonds,
                };
            })
        }));
    }
}