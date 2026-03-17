import { randomUUID } from "node:crypto";
import { PurchaseShopBundleData, ShopBundlePurchaseData, ShopFurniturePurchaseData, UserFurnitureCustomData, UserFurnitureData } from "@pixel63/events";
import User from "../../../../Users/User";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import { ShopPageModel } from "../../../../Database/Models/Shop/ShopPageModel";
import { ShopPageBundleModel } from "../../../../Database/Models/Shop/ShopPageBundleModel";
import { ShopPageFurnitureModel } from "../../../../Database/Models/Shop/ShopPageFurnitureModel";
import { UserFurnitureModel } from "../../../../Database/Models/Users/Furniture/UserFurnitureModel";
import { FurnitureModel } from "../../../../Database/Models/Furniture/FurnitureModel";

export default class PurchaseShopBundleEvent implements ProtobuffListener<PurchaseShopBundleData> {
    async handle(user: User, payload: PurchaseShopBundleData) {
        const bundle = await ShopPageBundleModel.findOne({
            where: {
                id: payload.id
            },
            include: [
                {
                    model: ShopPageModel,
                    as: "page",

                    include: [
                        {
                            model: ShopPageFurnitureModel,
                            as: "furniture",

                            include: [
                                {
                                    model: FurnitureModel,
                                    as: "furniture"
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if(!bundle) {
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

        for(const shopFurniture of bundle.page.furniture) {
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

            if(userFurniture.furniture.interactionType === "teleport" || userFurniture.furniture.interactionType === "teleporttile") {
                const secondUserFurniture = await UserFurnitureModel.create({
                    id: randomUUID(),
                    position: null,
                    direction: null,
                    animation: 0,
                    data: UserFurnitureCustomData.create({
                        teleport: {
                            furnitureId: userFurniture.id
                        }
                    }),
                    
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
                    data: UserFurnitureCustomData.create({
                        teleport: {
                            furnitureId: secondUserFurniture.id
                        }
                    })
                });

                await user.getInventory().addFurniture(secondUserFurniture);
            }

            await userFurniture.save();

            await user.getInventory().addFurniture(userFurniture);
        }

        user.sendProtobuff(ShopBundlePurchaseData, ShopBundlePurchaseData.create({
            success: true
        }));

        user.sendUserData();
    }
}
