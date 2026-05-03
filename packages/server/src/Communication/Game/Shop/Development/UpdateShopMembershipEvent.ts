import User from "../../../../Users/User.js";
import { randomUUID } from "node:crypto";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { GetShopPageMembershipsData, UpdateShopMembershipData } from "@pixel63/events";
import { ShopPageMembershipModel } from "../../../../Database/Models/Shop/ShopPageMembershipModel.js";
import GetShopPageMembershipsEvent from "../GetShopPageMembershipsEvent.js";

export default class UpdateShopMembershipEvent implements ProtobuffListener<UpdateShopMembershipData> {
    async handle(user: User, payload: UpdateShopMembershipData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("shop:edit")) {
            throw new Error("User is not privileged to edit the shope.");
        }

        if(payload.id !== undefined) {
            await ShopPageMembershipModel.update({
                membership: payload.membership,
                days: payload.days,

                credits: (payload.credits > 0)?(payload.credits):(null),
                duckets: (payload.duckets > 0)?(payload.duckets):(null),
                diamonds: (payload.diamonds > 0)?(payload.diamonds):(null),
            }, {
                where: {
                    id: payload.id
                }
            });
        }
        else {
            await ShopPageMembershipModel.create({
                id: randomUUID(),
                
                shopPageId: payload.pageId,

                membership: payload.membership,
                days: payload.days,

                credits: (payload.credits > 0)?(payload.credits):(null),
                duckets: (payload.duckets > 0)?(payload.duckets):(null),
                diamonds: (payload.diamonds > 0)?(payload.diamonds):(null),
            });
        }

        await (new GetShopPageMembershipsEvent()).handle(user, GetShopPageMembershipsData.create({
            pageId: payload.pageId
        }));
    }
}
