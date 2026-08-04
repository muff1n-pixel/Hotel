import User from "../../../../Users/User.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { DeleteShopMembershipData, GetShopPageMembershipsData } from "@pixel63/events";
import { ShopPageMembershipModel } from "../../../../Database/Models/Shop/ShopPageMembershipModel.js";
import GetShopPageMembershipsEvent from "../GetShopPageMembershipsEvent.js";

export default class DeleteShopMembershipEvent implements ProtobuffListener<DeleteShopMembershipData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User, payload: DeleteShopMembershipData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("shop:edit")) {
            throw new Error("User is not privileged to edit the shope.");
        }

        const shopMembership = await ShopPageMembershipModel.findByPk(payload.id);

        if(!shopMembership) {
            throw new Error("Shop furniture does not exist.");
        }

        await shopMembership.destroy();

        await (new GetShopPageMembershipsEvent()).handle(user, GetShopPageMembershipsData.create({
            pageId: shopMembership.shopPageId
        }));
    }
}
