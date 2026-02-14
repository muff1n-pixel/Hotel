import User from "../../../../Users/User.js";
import { ShopPageModel } from "../../../../Database/Models/Shop/ShopPageModel.js";
import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import { UpdateShopPageEventData } from "@shared/Communications/Requests/Shop/Development/UpdateShopPageEventData.js";
import GetShopPagesEvent from "../GetShopPagesEvent.js";

export default class UpdateShopPageEvent implements IncomingEvent<UpdateShopPageEventData> {
    async handle(user: User, event: UpdateShopPageEventData) {
        if(!user.model.developer) {
            throw new Error("User is not a developer.");
        }
        
        await ShopPageModel.update({
            title: event.title,
            description: event.description ?? null,

            icon: event.icon ?? null,
            header: event.header ?? null,
            teaser: event.teaser ?? null
        }, {
            where: {
                id: event.id
            }
        });

        await (new GetShopPagesEvent()).handle(user, {
            category: "furniture"
        });
    }
}
