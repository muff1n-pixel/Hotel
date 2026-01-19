import User from "../../../Users/User.js";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { GetShopPagesEventData } from "@shared/Communications/Requests/Shop/GetShopPagesEventData.js";
import { ShopPagesEventData } from "@shared/Communications/Responses/Shop/ShopPagesEventData.js";

export default class GetShopPagesEvent implements IncomingEvent<GetShopPagesEventData> {
    async handle(user: User, event: GetShopPagesEventData) {
        if(event.category !== "furniture") {
            return;
        }

        const shopPages: ShopPageModel[] = await ShopPageModel.findAll({
            where: {
                category: "furniture",
                parentId: null
            },
            include: {
                model: ShopPageModel,
                as: "children"
            }
        });

        user.send(new OutgoingEvent<ShopPagesEventData>("ShopPagesEventData", {
            category: "furniture",
            pages: shopPages.map((shopPage) => {
                return {
                    id: shopPage.id,

                    title: shopPage.title,
                    description: shopPage.description,
                    
                    icon: shopPage.icon ?? undefined,
                    header: shopPage.header ?? undefined,
                    
                    type: shopPage.type,
                    
                    children: shopPage.children.map((shopPage) => {
                        return {
                            id: shopPage.id,
                            title: shopPage.title,
                            type: shopPage.type,
                            icon: shopPage.icon ?? undefined,
                        };
                    })
                };
            })
        }));
    }
}