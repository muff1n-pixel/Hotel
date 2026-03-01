import User from "../../../Users/User.js";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { GetShopPagesEventData } from "@shared/Communications/Requests/Shop/GetShopPagesEventData.js";
import { ShopPageFeatureModel } from "../../../Database/Models/Shop/ShopPageFeatureModel.js";
import { ShopPagesData } from "@pixel63/events";

export default class GetShopPagesEvent implements IncomingEvent<GetShopPagesEventData> {
    public readonly name = "GetShopPagesEvent";
    
    async handle(user: User, event: GetShopPagesEventData) {
        switch(event.category) {
            case "furniture":
                return this.handleFurniture(user, event);

            case "frontpage":
                return this.handleFurniture(user, event);
        }
    }

    async handleFurniture(user: User, event: GetShopPagesEventData) {
        const shopPages: ShopPageModel[] = await ShopPageModel.findAll({
            where: {
                category: event.category,
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
            category: event.category,
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