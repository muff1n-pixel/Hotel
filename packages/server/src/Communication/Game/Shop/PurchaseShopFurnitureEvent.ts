import User from "../../../Users/User.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { PurchaseShopFurnitureEventData } from "@shared/Communications/Requests/Shop/PurchaseShopFurnitureEventData.js";
import { ShopPageFurnitureModel } from "../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";
import { ShopFurniturePurchasedEventData } from "@shared/Communications/Responses/Shop/ShopFurniturePurchasedEventData.js";

export default class PurchaseShopFurnitureEvent implements IncomingEvent<PurchaseShopFurnitureEventData> {
    async handle(user: User, event: PurchaseShopFurnitureEventData) {
        const shopFurniture = await ShopPageFurnitureModel.findOne({
            where: {
                id: event.shopFurnitureId
            },
            include: {
                model: FurnitureModel,
                as: "furniture"
            }
        });

        if(!shopFurniture) {
            user.send(new OutgoingEvent<ShopFurniturePurchasedEventData>("ShopFurniturePurchasedEvent", {
                success: false
            }));

            return;
        }

        await user.getInventory().addFurniture(shopFurniture.furniture);

        user.send(new OutgoingEvent<ShopFurniturePurchasedEventData>("ShopFurniturePurchasedEvent", {
            success: true
        }));
    }
}