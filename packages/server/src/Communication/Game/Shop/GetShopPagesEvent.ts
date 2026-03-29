import User from "../../../Users/User.js";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { ShopPageFeatureModel } from "../../../Database/Models/Shop/ShopPageFeatureModel.js";
import { GetShopPagesData, ShopFeatureData, ShopPagesData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { ShopPageBundleModel } from "../../../Database/Models/Shop/ShopPageBundleModel.js";
import { BadgeModel } from "../../../Database/Models/Badges/BadgeModel.js";
import UserPermissions from "../../../Users/Permissions/UserPermissions.js";

export default class GetShopPagesEvent implements ProtobuffListener<GetShopPagesData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: GetShopPagesData) {
        return this.handleFurniture(user, payload);
    }

    async handleFurniture(user: User, payload: GetShopPagesData) {
        const shopPages: ShopPageModel[] = await ShopPageModel.findAll({
            where: {
                ...((payload.category !== "all") && {
                    category: payload.category,
                })
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

        const permissions = await user.getPermissions();

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

                    ...((shopPage.type === "features") && {
                        featureVertical: this.getFeatureData(permissions, shopPage.featureVertical),

                        featureHorizontalTop: this.getFeatureData(permissions, shopPage.featureHorizontalTop),
                        featureHorizontalMiddle: this.getFeatureData(permissions, shopPage.featureHorizontalMiddle),
                        featureHorizontalBottom: this.getFeatureData(permissions, shopPage.featureHorizontalBottom),
                    }),

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

    private getFeatureData(permissions: UserPermissions, feature?: ShopPageFeatureModel): ShopFeatureData | undefined {
        if(!feature) {
            return undefined;
        }

        if(permissions.hasPermission("shop:edit")) {
            return ShopFeatureData.fromJSON(feature);
        }

        return ShopFeatureData.fromJSON({
            ...feature,
            configuration: undefined
        });
    }
}
