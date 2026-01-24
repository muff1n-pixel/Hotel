import User from "../../../Users/User.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { PurchaseShopFurnitureEventData } from "@shared/Communications/Requests/Shop/PurchaseShopFurnitureEventData.js";
import { ShopPageFurnitureModel } from "../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";
import { ShopFurniturePurchasedEventData } from "@shared/Communications/Responses/Shop/ShopFurniturePurchasedEventData.js";
import { UserEventData } from "@shared/Communications/Responses/User/UserEventData.js";
import RoomFurniture from "../../../Rooms/Furniture/RoomFurniture.js";

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

        if((shopFurniture.credits && user.model.credits < shopFurniture.credits)) {
            user.send(new OutgoingEvent<ShopFurniturePurchasedEventData>("ShopFurniturePurchasedEvent", {
                success: false
            }));

            return;
        }

        if((shopFurniture.duckets && user.model.duckets < shopFurniture.duckets)) {
            user.send(new OutgoingEvent<ShopFurniturePurchasedEventData>("ShopFurniturePurchasedEvent", {
                success: false
            }));

            return;
        }

        if((shopFurniture.diamonds && user.model.diamonds < shopFurniture.diamonds)) {
            user.send(new OutgoingEvent<ShopFurniturePurchasedEventData>("ShopFurniturePurchasedEvent", {
                success: false
            }));

            return;
        }

        user.model.credits -= shopFurniture.credits ?? 0;
        user.model.duckets -= shopFurniture.duckets ?? 0;
        user.model.diamonds -= shopFurniture.diamonds ?? 0;

        await user.model.save();

        if(user.room && event.position && event.direction !== undefined) {
            RoomFurniture.create(user.room, user, shopFurniture.furniture, event.position, event.direction);
        }
        else {
            await user.getInventory().addFurniture(shopFurniture.furniture);
        }

        user.send([
            new OutgoingEvent<ShopFurniturePurchasedEventData>("ShopFurniturePurchasedEvent", {
                success: true
            }),
            new OutgoingEvent<UserEventData>("UserEvent", {
                id: user.model.id,
                name: user.model.name,
                figureConfiguration: user.model.figureConfiguration,
                credits: user.model.credits,
                duckets: user.model.duckets,
                diamonds: user.model.diamonds,
            })
        ]);
    }
}