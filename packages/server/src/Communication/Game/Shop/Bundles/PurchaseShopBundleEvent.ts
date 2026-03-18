import { PurchaseShopBundleData, ShopBundlePurchaseData, ShopFurniturePurchaseData } from "@pixel63/events";
import User from "../../../../Users/User";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import { ShopPageModel } from "../../../../Database/Models/Shop/ShopPageModel";
import { ShopPageBundleModel } from "../../../../Database/Models/Shop/ShopPageBundleModel";
import { UserFurnitureModel } from "../../../../Database/Models/Users/Furniture/UserFurnitureModel";
import { RoomModel } from "../../../../Database/Models/Rooms/RoomModel";
import { randomUUID } from "node:crypto";
import { UserBadgeModel } from "../../../../Database/Models/Users/Badges/UserBadgeModel";

export default class PurchaseShopBundleEvent implements ProtobuffListener<PurchaseShopBundleData> {
    async handle(user: User, payload: PurchaseShopBundleData) {
        const bundle = await ShopPageBundleModel.findOne({
            where: {
                id: payload.id
            },
            include: [
                {
                    model: ShopPageModel,
                    as: "page"
                },
                {
                    model: RoomModel,
                    as: "room",

                    include: [
                        {
                            model: UserFurnitureModel,
                            as: "roomFurnitures"
                        }
                    ]
                }
            ]
        });

        if(!bundle?.room) {
            user.sendProtobuff(ShopFurniturePurchaseData, ShopFurniturePurchaseData.create({
                success: false
            }));

            return;
        }

        if((bundle.credits && user.model.credits < bundle.credits)) {
            user.sendProtobuff(ShopFurniturePurchaseData, ShopFurniturePurchaseData.create({
                success: false
            }));

            return;
        }

        if((bundle.duckets && user.model.duckets < bundle.duckets)) {
            user.sendProtobuff(ShopFurniturePurchaseData, ShopFurniturePurchaseData.create({
                success: false
            }));

            return;
        }

        if((bundle.diamonds && user.model.diamonds < bundle.diamonds)) {
            user.sendProtobuff(ShopFurniturePurchaseData, ShopFurniturePurchaseData.create({
                success: false
            }));

            return;
        }

        user.model.credits -= bundle.credits ?? 0;
        user.model.duckets -= bundle.duckets ?? 0;
        user.model.diamonds -= bundle.diamonds ?? 0;

        await user.model.save();

        const room = await RoomModel.create({
            id: randomUUID(),

            ownerId: user.model.id,

            name: bundle.room.name,
            description: bundle.room.description,

            categoryId: bundle.room.categoryId,

            structure: bundle.room.structure,
            thumbnail: bundle.room.thumbnail,
        });

        await UserFurnitureModel.bulkCreate(bundle.room.roomFurnitures.map((userFurniture) => {
            return {
                id: randomUUID(),
                
                position: userFurniture.position,
                direction: userFurniture.direction,
                animation: userFurniture.animation,
                color: userFurniture.color,
                data: userFurniture.data,

                furnitureId: userFurniture.furnitureId,
                userId: user.model.id,
                roomId: room.id
            };
        }));

        if(bundle.badge) {
            const [badge, created] = await UserBadgeModel.findOrCreate({
                where: {
                    badgeId: bundle.badge.id,
                    userId: user.model.id,
                },
                defaults: {
                    id: randomUUID(),

                    badgeId: bundle.badge.id,
                    userId: user.model.id,

                    equipped: false
                }
            });

            if(created) {
                await user.getInventory().sendBadges();
            }
        }

        user.sendProtobuff(ShopBundlePurchaseData, ShopBundlePurchaseData.create({
            success: true,
            roomId: room.id
        }));

        user.sendUserData();
    }
}
