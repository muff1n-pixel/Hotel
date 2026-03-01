import User from "../../../Users/User.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { PurchaseShopFurnitureEventData } from "@shared/Communications/Requests/Shop/PurchaseShopFurnitureEventData.js";
import { ShopPageFurnitureModel } from "../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";
import RoomFurniture from "../../../Rooms/Furniture/RoomFurniture.js";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { randomUUID } from "node:crypto";
import { RoomFurnitureTrophyData } from "@shared/Interfaces/Room/Furniture/RoomFurnitureTrophyData.js";
import { ShopFurniturePurchaseData } from "@pixel63/events";

export default class PurchaseShopFurnitureEvent implements IncomingEvent<PurchaseShopFurnitureEventData> {
    public readonly name = "PurchaseShopFurnitureEvent";

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
            user.sendProtobuff(ShopFurniturePurchaseData, ShopFurniturePurchaseData.create({
                success: false
            }));

            return;
        }

        if((shopFurniture.credits && user.model.credits < shopFurniture.credits)) {
            user.sendProtobuff(ShopFurniturePurchaseData, ShopFurniturePurchaseData.create({
                success: false
            }));

            return;
        }

        if((shopFurniture.duckets && user.model.duckets < shopFurniture.duckets)) {
            user.sendProtobuff(ShopFurniturePurchaseData, ShopFurniturePurchaseData.create({
                success: false
            }));

            return;
        }

        if((shopFurniture.diamonds && user.model.diamonds < shopFurniture.diamonds)) {
            user.sendProtobuff(ShopFurniturePurchaseData, ShopFurniturePurchaseData.create({
                success: false
            }));

            return;
        }

        user.model.credits -= shopFurniture.credits ?? 0;
        user.model.duckets -= shopFurniture.duckets ?? 0;
        user.model.diamonds -= shopFurniture.diamonds ?? 0;

        await user.model.save();

        const userFurniture = await UserFurnitureModel.create({
            id: randomUUID(),
            position: null,
            direction: null,
            animation: 0,
            color: null,
            data: null,
            
            roomId: null,
            userId: user.model.id,
            furnitureId: shopFurniture.furniture.id
        }, {
            include: [
                {
                    model: FurnitureModel,
                    as: "furniture"
                }
            ]
        });

        userFurniture.user = user.model;
        userFurniture.furniture = shopFurniture.furniture;

        if(userFurniture.furniture.interactionType === "trophy" && event.data) {
            userFurniture.data = {
                engraving: (event.data as RoomFurnitureTrophyData).engraving ?? "",
                date: new Date().toISOString().split('T')[0]!.toString(),
                author: user.model.name
            } satisfies RoomFurnitureTrophyData;

            await userFurniture.save();
        }

        if(userFurniture.furniture.interactionType === "teleport" || userFurniture.furniture.interactionType === "teleporttile") {
            const secondUserFurniture = await UserFurnitureModel.create({
                id: randomUUID(),
                position: null,
                direction: null,
                animation: 0,
                data: userFurniture.id,
                
                roomId: null,
                userId: user.model.id,
                furnitureId: shopFurniture.furniture.id
            }, {
                include: [
                    {
                        model: FurnitureModel,
                        as: "furniture"
                    }
                ]
            });

            secondUserFurniture.user = user.model;
            secondUserFurniture.furniture = shopFurniture.furniture;

            await userFurniture.update({
                data: secondUserFurniture.id
            });

            await user.getInventory().addFurniture(secondUserFurniture);
        }

        if(user.room && event.position && event.direction !== undefined) {
            RoomFurniture.place(user.room, userFurniture, event.position, event.direction);
        }
        else {
            await user.getInventory().addFurniture(userFurniture);
        }

        user.sendProtobuff(ShopFurniturePurchaseData, ShopFurniturePurchaseData.create({
            success: true
        }));

        user.sendUserData();
    }
}