import User from "../../../../Users/User.js";
import { ShopPageModel } from "../../../../Database/Models/Shop/ShopPageModel.js";
import GetShopPagesEvent from "../GetShopPagesEvent.js";
import { randomUUID } from "node:crypto";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { UpdateShopPageData } from "@pixel63/events";

export default class UpdateShopPageEvent implements ProtobuffListener<UpdateShopPageData> {
    public readonly name = "UpdateShopPageEvent";

    async handle(user: User, payload: UpdateShopPageData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("shop:edit")) {
            throw new Error("User is not privileged to edit the shope.");
        }
        
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
                id: randomUUID(),
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

        await (new GetShopPagesEvent()).handle(user, {
            category: "furniture"
        });
    }
}
