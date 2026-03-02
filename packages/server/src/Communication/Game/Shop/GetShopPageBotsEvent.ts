import User from "../../../Users/User.js";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { ShopPageBotModel } from "../../../Database/Models/Shop/ShopPageBotModel.js";
import { GetShopPageBotsData, ShopPageBotsData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class GetShopPageBotsEvent implements ProtobuffListener<GetShopPageBotsData> {
    public readonly name = "GetShopPageBotsEvent";

    async handle(user: User, payload: GetShopPageBotsData) {
        const shopPage = await ShopPageModel.findByPk(payload.pageId, {
            include: {
                model: ShopPageBotModel,
                as: "bots"
            }
        });

        if(!shopPage) {
            throw new Error("Shop page does not exist.");
        }

        user.sendProtobuff(ShopPageBotsData, ShopPageBotsData.create({
            pageId: shopPage.id,
            bots: shopPage.bots.map((bot) => {
                return {
                    id: bot.id,

                    name: bot.name,
                    motto: bot.motto ?? undefined,

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