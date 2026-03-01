import User from "../../../../Users/User.js";
import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import { FurnitureModel } from "../../../../Database/Models/Furniture/FurnitureModel.js";
import { ShopPageFurnitureModel } from "../../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import GetShopPageFurnitureEvent from "../GetShopPageFurnitureEvent.js";
import { randomUUID } from "node:crypto";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { GetShopPageFurnitureData, UpdateShopFurnitureData } from "@pixel63/events";

export default class UpdateShopFurnitureEvent implements ProtobuffListener<UpdateShopFurnitureData> {
    public readonly name = "UpdateShopFurnitureEvent";

    async handle(user: User, payload: UpdateShopFurnitureData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("shop:edit")) {
            throw new Error("User is not privileged to edit the shope.");
        }

        let furniture = await FurnitureModel.findOne({
            where: {
                type: payload.type,
                color: payload.color
            }
        });

        if(!furniture) {
            furniture = await FurnitureModel.findOne({
                where: {
                    type: payload.type,
                    color: null
                }
            });
        }

        if(!furniture) {
            throw new Error("Furniture by type and color does not exist.");
        }
        
        if(payload.id !== undefined) {
            await ShopPageFurnitureModel.update({
                furnitureId: furniture.id,

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
            await ShopPageFurnitureModel.create({
                id: randomUUID(),
                
                shopPageId: payload.pageId,
                furnitureId: furniture.id,

                credits: (payload.credits > 0)?(payload.credits):(null),
                duckets: (payload.duckets > 0)?(payload.duckets):(null),
                diamonds: (payload.diamonds > 0)?(payload.diamonds):(null),
            });
        }

        await (new GetShopPageFurnitureEvent()).handle(user, GetShopPageFurnitureData.create({
            pageId: payload.pageId
        }));
    }
}
