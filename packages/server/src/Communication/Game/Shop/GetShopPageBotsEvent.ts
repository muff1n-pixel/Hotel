import User from "../../../Users/User.js";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { GetShopPageBotsEventData } from "@shared/Communications/Requests/Shop/GetShopPageBotsEventData.js";
import { ShopPageFurnitureEventData } from "@shared/Communications/Responses/Shop/ShopPageFurnitureEventData.js";
import { ShopPageBotModel } from "../../../Database/Models/Shop/ShopPageBotModel.js";
import { ShopPageBotsEventData } from "@shared/Communications/Responses/Shop/ShopPageBotsEventData.js";

export default class GetShopPageBotsEvent implements IncomingEvent<GetShopPageBotsEventData> {
    public readonly name = "GetShopPageBotsEvent";

    async handle(user: User, event: GetShopPageBotsEventData) {
        const shopPage = await ShopPageModel.findByPk(event.pageId, {
            include: {
                model: ShopPageBotModel,
                as: "bots"
            }
        });

        if(!shopPage) {
            throw new Error("Shop page does not exist.");
        }

        user.send(new OutgoingEvent<ShopPageBotsEventData>("ShopPageBotsEvent", {
            pageId: shopPage.id,
            bots: shopPage.bots.map((bot) => {
                return {
                    id: bot.id,

                    name: bot.name,
                    motto: bot.motto,

                    figureConfiguration: bot.figureConfiguration,

                    type: bot.type,

                    credits: bot.credits,
                    duckets: bot.duckets,
                    diamonds: bot.diamonds
                }
            })
        }));
    }
}