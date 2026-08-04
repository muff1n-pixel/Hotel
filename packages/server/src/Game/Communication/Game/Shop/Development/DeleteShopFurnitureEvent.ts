import User from "../../../../Users/User.js";
import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import { FurnitureModel } from "../../../../Database/Models/Furniture/FurnitureModel.js";
import { ShopPageFurnitureModel } from "../../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import GetShopPageFurnitureEvent from "../GetShopPageFurnitureEvent.js";
import { randomUUID } from "node:crypto";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { DeleteShopFurnitureData, GetShopPageFurnitureData, UpdateShopFurnitureData } from "@pixel63/events";

export default class DeleteShopFurnitureEvent implements ProtobuffListener<DeleteShopFurnitureData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User, payload: DeleteShopFurnitureData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("shop:edit")) {
            throw new Error("User is not privileged to edit the shope.");
        }

        const shopFurniture = await ShopPageFurnitureModel.findByPk(payload.id);

        if(!shopFurniture) {
            throw new Error("Shop furniture does not exist.");
        }

        await shopFurniture.destroy();

        await (new GetShopPageFurnitureEvent()).handle(user, GetShopPageFurnitureData.create({
            pageId: shopFurniture.shopPageId
        }));
    }
}
