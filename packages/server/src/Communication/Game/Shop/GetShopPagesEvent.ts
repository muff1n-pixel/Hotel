import User from "../../../Users/User.js";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { ShopPageFeatureModel } from "../../../Database/Models/Shop/ShopPageFeatureModel.js";
import { GetShopPagesData, ShopPagesData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { ShopPageBundleModel } from "../../../Database/Models/Shop/ShopPageBundleModel.js";
import { BadgeModel } from "../../../Database/Models/Badges/BadgeModel.js";

export default class GetShopPagesEvent implements ProtobuffListener<GetShopPagesData> {
    public readonly name = "GetShopPagesEvent";
    
    async handle(user: User, payload: GetShopPagesData) {
        switch(payload.category) {
            case "furniture":
                return this.handleFurniture(user, payload);

            case "frontpage":
                return this.handleFurniture(user, payload);

            case "pets":
                return this.handleFurniture(user, payload);
        }
    }

    async handleFurniture(user: User, payload: GetShopPagesData) {
        const shopPages: ShopPageModel[] = await ShopPageModel.findAll({
            where: {
                category: payload.category,
            },
            include: [
                ...(["featureVertical", "featureHorizontalTop", "featureHorizontalMiddle", "featureHorizontalBottom"].map((as) => ({
                    model: ShopPageFeatureModel,
                    as,
                    include: [
                        {
                            model: ShopPageModel,
                            as: "featuredPage"
                        }
                    ]
                }))),
                {
                    model: ShopPageFeatureModel,
                    as: "featureHorizontalTop",
                    include: [
                        {
                            model: ShopPageModel,
                            as: "featuredPage"
                        }
                    ]
                },
                {
                    model: ShopPageBundleModel,
                    as: "bundle",

                    include: [
                        {
                            model: BadgeModel,
                            as: "badge"
                        }
                    ]
                }
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

                    featureVertical: shopPage.featureVertical,

                    featureHorizontalTop: shopPage.featureHorizontalTop,
                    featureHorizontalMiddle: shopPage.featureHorizontalMiddle,
                    featureHorizontalBottom: shopPage.featureHorizontalBottom,

                    ...(shopPage.bundle && {
                        bundle: {
                            id: shopPage.bundle.id,
                            
                            credits: shopPage.bundle.credits,
                            duckets: shopPage.bundle.duckets,
                            diamonds: shopPage.bundle.diamonds,

                            roomId: shopPage.bundle.roomId,

                            ...(shopPage.bundle.badge && {
                                badge: {
                                    id: shopPage.bundle.badge.id,
                                    image: shopPage.bundle.badge.image,

                                    name: shopPage.bundle.badge.name ?? undefined,
                                    description: shopPage.bundle.badge.description ?? undefined,
                                }
                            })
                        }
                    })
                };
            })
        }));
    }
}