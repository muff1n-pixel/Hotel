import User from "../../../../Users/User.js";
import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import { UpdateShopFurnitureEventData } from "@shared/Communications/Requests/Shop/Development/UpdateShopFurnitureEventData.js";
import { FurnitureModel } from "../../../../Database/Models/Furniture/FurnitureModel.js";
import { ShopPageFurnitureModel } from "../../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import GetShopPageFurnitureEvent from "../GetShopPageFurnitureEvent.js";
import { randomUUID } from "node:crypto";

export default class UpdateShopFurnitureEvent implements IncomingEvent<UpdateShopFurnitureEventData> {
    public readonly name = "UpdateShopFurnitureEvent";

    async handle(user: User, event: UpdateShopFurnitureEventData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("shop:edit")) {
            throw new Error("User is not privileged to edit the shope.");
        }

        let furniture = await FurnitureModel.findOne({
            where: {
                type: event.type,
                color: event.color
            }
        });

        if(!furniture) {
            furniture = await FurnitureModel.findOne({
                where: {
                    type: event.type,
                    color: null
                }
            });
        }

        if(!furniture) {
            throw new Error("Furniture by type and color does not exist.");
        }
        
        if(event.id !== null) {
            await ShopPageFurnitureModel.update({
                furnitureId: furniture.id,

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
            await ShopPageFurnitureModel.create({
                id: randomUUID(),
                
                shopPageId: event.pageId,
                furnitureId: furniture.id,

                credits: (event.credits > 0)?(event.credits):(null),
                duckets: (event.duckets > 0)?(event.duckets):(null),
                diamonds: (event.diamonds > 0)?(event.diamonds):(null),
            });
        }

        await (new GetShopPageFurnitureEvent()).handle(user, {
            pageId: event.pageId
        });
    }
}
