import User from "../../../Users/User.js";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";
import { ShopPageFurnitureModel } from "../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";
import { GetShopPageFurnitureData, ShopPageFurnitureData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { Op } from "sequelize";

export default class GetShopPageFurnitureEvent implements ProtobuffListener<GetShopPageFurnitureData> {
    minimumDurationBetweenEvents?: number = 20;

    async handle(user: User, payload: GetShopPageFurnitureData) {
        let furniture: ShopPageFurnitureModel[] = [];

        if(payload.search?.length) {
            furniture = await ShopPageFurnitureModel.findAll({
                where: {
                    [Op.or]: [
                        {
                            '$furniture.name$': {
                                [Op.like]: `%${payload.search}%`
                            }
                        },
                        {
                            '$furniture.description$': {
                                [Op.like]: `%${payload.search}%`
                            }
                        }
                    ]
                },
                include: [
                    {
                        model: FurnitureModel,
                        as: 'furniture'
                    }
                ],
                limit: 30
            });
        }
        else {
            const shopPage = await ShopPageModel.findByPk(payload.pageId, {
                include: {
                    model: ShopPageFurnitureModel,
                    as: "furniture",
                    include: [
                        {
                            model: FurnitureModel,
                            as: "furniture"
                        }
                    ]
                }
            });

            if(!shopPage) {
                throw new Error("Shop page does not exist.");
            }

            furniture = shopPage.furniture;
        }

        user.sendProtobuff(ShopPageFurnitureData, ShopPageFurnitureData.fromJSON({
            pageId: payload.pageId,
            furniture: furniture.sort((a, b) => a.furniture.type.localeCompare(b.furniture.type)).map((furniture) => {
                return {
                    id: furniture.id,
                    furniture: furniture.furniture,
                    credits: furniture.credits,
                    duckets: furniture.duckets,
                    diamonds: furniture.diamonds,
                    membership: furniture.membership
                }
            })
        }));
    }
}