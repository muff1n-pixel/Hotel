import User from "../../../../Users/User.js";
import { ShopPageModel } from "../../../../Database/Models/Shop/ShopPageModel.js";
import { FurnitureModel } from "../../../../Database/Models/Furniture/FurnitureModel.js";
import { FurnitureData, GetShopPageBundleFurnitureData, ShopFurnitureData, ShopPageFurnitureData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { ShopPageBundleModel } from "../../../../Database/Models/Shop/ShopPageBundleModel.js";
import { RoomModel } from "../../../../Database/Models/Rooms/RoomModel.js";
import { UserFurnitureModel } from "../../../../Database/Models/Users/Furniture/UserFurnitureModel.js";

export default class GetShopPageBundleFurnitureEvent implements ProtobuffListener<GetShopPageBundleFurnitureData> {
    async handle(user: User, payload: GetShopPageBundleFurnitureData) {
        const shopPage = await ShopPageModel.findByPk(payload.pageId, {
            include: {
                model: ShopPageBundleModel,
                as: "bundle",
                include: [
                    {
                        model: RoomModel,
                        as: "room",

                        include: [
                            {
                                model: UserFurnitureModel,
                                as: "roomFurnitures",

                                attributes: [
                                    "id",
                                    "furnitureId"
                                ]
                            }
                        ]
                    }
                ]
            }
        });

        if(!shopPage) {
            throw new Error("Shop page does not exist.");
        }

        if(!shopPage.bundle?.room) {
            throw new Error("Shop page bundle does not have a room.");
        }
        
        const uniqueFurniture: ShopFurnitureData[] = [];

        for(const userFurniture of shopPage.bundle.room.roomFurnitures) {
            const existingUniqueFurniture = uniqueFurniture.find((uniqueFurniture) => uniqueFurniture.furniture?.id === userFurniture.furnitureId);

            if(existingUniqueFurniture) {
                existingUniqueFurniture.quantity = (existingUniqueFurniture.quantity ?? 0) + 1;

                continue;
            }

            const furniture = await FurnitureModel.findByPk(userFurniture.furnitureId);

            if(furniture) {
                uniqueFurniture.push(ShopFurnitureData.create({
                    id: userFurniture.id,
                    furniture: FurnitureData.fromJSON(furniture)
                }));
            }
        }

        user.sendProtobuff(ShopPageFurnitureData, ShopPageFurnitureData.fromJSON({
            pageId: shopPage.id,
            furniture: uniqueFurniture
        }));
    }
}