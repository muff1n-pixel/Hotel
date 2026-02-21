import User from "../../../../Users/User.js";
import { ShopPageModel } from "../../../../Database/Models/Shop/ShopPageModel.js";
import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import { UpdateShopPageEventData } from "@shared/Communications/Requests/Shop/Development/UpdateShopPageEventData.js";
import GetShopPagesEvent from "../GetShopPagesEvent.js";
import { randomUUID } from "node:crypto";

export default class UpdateShopPageEvent implements IncomingEvent<UpdateShopPageEventData> {
    public readonly name = "UpdateShopPageEvent";

    async handle(user: User, event: UpdateShopPageEventData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("shop:edit")) {
            throw new Error("User is not privileged to edit the shope.");
        }
        
        if(event.id !== null) {
            await ShopPageModel.update({
                parentId: event.parentId ?? null,

                title: event.title,
                description: event.description ?? null,

                category: event.category,

                type: event.type ?? "default",

                icon: event.icon ?? null,
                header: event.header ?? null,
                teaser: event.teaser ?? null,

                index: event.index,
            }, {
                where: {
                    id: event.id
                }
            });
        }
        else {
            await ShopPageModel.create({
                id: randomUUID(),
                parentId: event.parentId ?? null,

                title: event.title,
                description: event.description ?? null,

                category: event.category,

                type: event.type ?? "default",

                icon: event.icon ?? null,
                header: event.header ?? null,
                teaser: event.teaser ?? null,

                index: event.index,
            });
        }

        await (new GetShopPagesEvent()).handle(user, {
            category: "furniture"
        });
    }
}
