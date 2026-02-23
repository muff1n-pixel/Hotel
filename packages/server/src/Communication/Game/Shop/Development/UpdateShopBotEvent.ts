import User from "../../../../Users/User.js";
import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import { UpdateShopBotEventData } from "@shared/Communications/Requests/Shop/Development/UpdateShopBotEventData.js";
import { ShopPageBotModel } from "../../../../Database/Models/Shop/ShopPageBotModel.js";
import { randomUUID } from "node:crypto";
import GetShopPageBotsEvent from "../GetShopPageBotsEvent.js";

export default class UpdateShopBotEvent implements IncomingEvent<UpdateShopBotEventData> {
    public readonly name = "UpdateShopBotEvent";

    async handle(user: User, event: UpdateShopBotEventData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("shop:edit")) {
            throw new Error("User is not privileged to edit the shope.");
        }
        
        if(event.id !== null) {
            await ShopPageBotModel.update({
                type: event.type,
                
                name: event.name,
                motto: event.motto ?? null,
                
                figureConfiguration: event.figureConfiguration,

                credits: (event.credits > 0)?(event.credits):(null),
                duckets: (event.duckets > 0)?(event.duckets):(null),
                diamonds: (event.diamonds > 0)?(event.diamonds):(null),
            }, {
                where: {
                    id: event.id
                }
            });
        }
        else {
            await ShopPageBotModel.create({
                id: randomUUID(),
                
                shopPageId: event.pageId,

                type: event.type,
                
                name: event.name,
                motto: event.motto ?? null,
                
                figureConfiguration: event.figureConfiguration,

                credits: (event.credits > 0)?(event.credits):(null),
                duckets: (event.duckets > 0)?(event.duckets):(null),
                diamonds: (event.diamonds > 0)?(event.diamonds):(null),
            });
        }

        await (new GetShopPageBotsEvent()).handle(user, {
            pageId: event.pageId
        });
    }
}
