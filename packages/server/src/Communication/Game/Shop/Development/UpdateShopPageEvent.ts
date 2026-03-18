import User from "../../../../Users/User.js";
import { ShopPageModel } from "../../../../Database/Models/Shop/ShopPageModel.js";
import GetShopPagesEvent from "../GetShopPagesEvent.js";
import { randomUUID } from "node:crypto";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { GetShopPagesData, UpdateShopPageData } from "@pixel63/events";
import { ShopPageBundleModel } from "../../../../Database/Models/Shop/ShopPageBundleModel.js";

export default class UpdateShopPageEvent implements ProtobuffListener<UpdateShopPageData> {
    public readonly name = "UpdateShopPageEvent";

    async handle(user: User, payload: UpdateShopPageData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("shop:edit")) {
            throw new Error("User is not privileged to edit the shope.");
        }

        const pageId = payload.id ?? randomUUID();
        
        if(payload.id !== undefined) {
            await ShopPageModel.update({
                parentId: payload.parentId ?? null,

                title: payload.title,
                description: payload.description ?? null,

                category: payload.category,

                type: payload.type ?? "default",

                icon: payload.icon ?? null,
                header: payload.header ?? null,
                teaser: payload.teaser ?? null,

                index: payload.index,
            }, {
                where: {
                    id: payload.id
                }
            });
        }
        else {
            await ShopPageModel.create({
                id: pageId,
                parentId: payload.parentId ?? null,

                title: payload.title,
                description: payload.description ?? null,

                category: payload.category,

                type: payload.type ?? "default",

                icon: payload.icon ?? null,
                header: payload.header ?? null,
                teaser: payload.teaser ?? null,

                index: payload.index,
            });
        }

        if(payload.bundle) {
            const bundleId = payload.bundle.id || randomUUID();

            await ShopPageBundleModel.upsert({
                id: bundleId,
                
                pageId,

                credits: payload.bundle.credits,
                duckets: payload.bundle.duckets,
                diamonds: payload.bundle.diamonds,

                roomId: payload.bundle.roomId,
                badgeId: payload.bundle.badge?.id
            });

            await ShopPageModel.update({
                bundleId
            }, {
                where: {
                    id: pageId
                }
            });
        }

        await (new GetShopPagesEvent()).handle(user, GetShopPagesData.create({
            category: payload.category
        }));
    }
}
