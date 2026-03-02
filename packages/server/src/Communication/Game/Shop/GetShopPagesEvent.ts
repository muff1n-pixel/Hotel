import User from "../../../Users/User.js";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { ShopPageFeatureModel } from "../../../Database/Models/Shop/ShopPageFeatureModel.js";
import { GetShopPagesData, ShopPagesData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class GetShopPagesEvent implements ProtobuffListener<GetShopPagesData> {
    public readonly name = "GetShopPagesEvent";
    
    async handle(user: User, payload: GetShopPagesData) {
        switch(payload.category) {
            case "furniture":
                return this.handleFurniture(user, payload);

            case "frontpage":
                return this.handleFurniture(user, payload);
        }
    }

    async handleFurniture(user: User, payload: GetShopPagesData) {
        const shopPages: ShopPageModel[] = await ShopPageModel.findAll({
            where: {
                category: payload.category,
            },
            include: [
                {
                    model: ShopPageFeatureModel,
                    as: "features",
                    order: ["index"],

                    include: [
                        {
                            model: ShopPageModel,
                            as: "featuredPage"
                        }
                    ]
                },
            ],
            order: ["index"]
        });

        user.sendProtobuff(ShopPagesData, ShopPagesData.create({
            category: payload.category,
            pages: shopPages.sort((a, b) => a.index - b.index).map((shopPage) => {
                return {
                    id: shopPage.id,
                    parentId: shopPage.parentId,
                    category: shopPage.category,

                    title: shopPage.title,
                    description: shopPage.description,
                    
                    icon: shopPage.icon ?? undefined,
                    header: shopPage.header ?? undefined,
                    teaser: shopPage.teaser ?? undefined,
                    
                    type: shopPage.type,

                    index: shopPage.index,

                    features: shopPage.features?.map((feature) => {
                        return {
                            id: feature.id,
                            title: feature.title,
                            image: feature.image,
                            type: feature.type,

                            page: {
                                id: feature.featuredPage.id,
                                category: feature.featuredPage.category
                            }
                        };
                    }) ?? []
                };
            })
        }));
    }
}