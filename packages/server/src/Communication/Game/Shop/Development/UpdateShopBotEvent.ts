import User from "../../../../Users/User.js";
import { ShopPageBotModel } from "../../../../Database/Models/Shop/ShopPageBotModel.js";
import { randomUUID } from "node:crypto";
import GetShopPageBotsEvent from "../GetShopPageBotsEvent.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { UpdateShopBotData } from "@pixel63/events";

export default class UpdateShopBotEvent implements ProtobuffListener<UpdateShopBotData> {
    async handle(user: User, payload: UpdateShopBotData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("shop:edit")) {
            throw new Error("User is not privileged to edit the shope.");
        }
        
        if(payload.id !== undefined) {
            await ShopPageBotModel.update({
                type: payload.type,
                
                name: payload.name,
                motto: payload.motto ?? null,
                
                figureConfiguration: payload.figureConfiguration,

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
            await ShopPageBotModel.create({
                id: randomUUID(),
                
                shopPageId: payload.pageId,

                type: payload.type,
                
                name: payload.name,
                motto: payload.motto ?? null,
                
                figureConfiguration: payload.figureConfiguration,

                credits: (payload.credits > 0)?(payload.credits):(null),
                duckets: (payload.duckets > 0)?(payload.duckets):(null),
                diamonds: (payload.diamonds > 0)?(payload.diamonds):(null),
            });
        }

        await (new GetShopPageBotsEvent()).handle(user, {
            pageId: payload.pageId
        });
    }
}
