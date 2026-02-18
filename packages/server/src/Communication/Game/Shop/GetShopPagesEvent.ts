import User from "../../../Users/User.js";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { GetShopPagesEventData } from "@shared/Communications/Requests/Shop/GetShopPagesEventData.js";
import { ShopPagesEventData } from "@shared/Communications/Responses/Shop/ShopPagesEventData.js";
import { ShopPageFeatureModel } from "../../../Database/Models/Shop/ShopPageFeatureModel.js";

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
                parentId: null
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
                {
                    model: ShopPageModel,
                    as: "children",
                    order: ["index"]
                },
            ],
            order: ["index"]
        });

        user.send(new OutgoingEvent<ShopPagesEventData>("ShopPagesEventData", {
            category: event.category,
            pages: shopPages.sort((a, b) => a.index - b.index).map((shopPage) => {
                return {
                    id: shopPage.id,
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
                    }),
                    
                    children: shopPage.children.sort((a, b) => a.index - b.index).map((childShopPage) => {
                        return {
                            id: childShopPage.id,
                            category: shopPage.category,

                            title: childShopPage.title,
                            description: childShopPage.description,
                            
                            type: childShopPage.type,
                            
                            icon: childShopPage.icon ?? undefined,
                            header: childShopPage.header ?? shopPage.header ?? undefined,
                            teaser: childShopPage.teaser ?? shopPage.teaser ?? undefined,

                            features: undefined,

                            index: childShopPage.index
                        };
                    })
                };
            })
        }));
    }
}